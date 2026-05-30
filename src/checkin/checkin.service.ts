import { Injectable } from '@nestjs/common';
import { DynamoRepository } from '../dynamo/dynamo.repository';
import { randomUUID } from 'crypto';
import {
  PutCommand,
  GetCommand,
  ScanCommand,
  UpdateCommand,
  DeleteCommand,
} from '@aws-sdk/lib-dynamodb';
import { CHECK_IN_TABLE_NAME } from '../dynamo/constants';
import { CheckInDto } from './dto/check-in.dto';
import { CheckInFilterDto } from './dto/check-in-filter.dto';
import { CheckInRecord } from './interfaces/check-in-record.interface';

@Injectable()
export class CheckInService {
  private readonly tableName = CHECK_IN_TABLE_NAME;

  constructor(private readonly dynamoRepository: DynamoRepository) {}

  /** Create a new check‑in record */
  async checkIn(dto: CheckInDto): Promise<CheckInRecord> {
    const item: CheckInRecord = {
      id: randomUUID(),
      userId: dto.userId,
      storeId: dto.storeId,
      timestamp: new Date().toISOString(),
    };
    await this.dynamoRepository.send(
      new PutCommand({ TableName: this.tableName, Item: item }),
    );
    return item;
  }

  /** Retrieve a single check‑in by its id */
  async findOne(id: string): Promise<CheckInRecord | undefined> {
    const result = await this.dynamoRepository.send(
      new GetCommand({ TableName: this.tableName, Key: { id } }),
    );
    return result.Item as CheckInRecord;
  }

  /** Update a check‑in record (partial) */
  async update(
    id: string,
    dto: Partial<CheckInDto>,
  ): Promise<CheckInRecord | undefined> {
    const keys = Object.keys(dto);
    if (keys.length === 0) {
      return this.findOne(id);
    }

    const updateExpressions = keys
      .map((key, i) => `#k${i} = :v${i}`)
      .join(', ');
    const expressionAttributeNames: Record<string, string> = {};
    const expressionAttributeValues: Record<string, any> = {};

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      expressionAttributeNames[`#k${i}`] = key;
      expressionAttributeValues[`:v${i}`] = (dto as any)[key];
    }

    await this.dynamoRepository.send(
      new UpdateCommand({
        TableName: this.tableName,
        Key: { id },
        UpdateExpression: `SET ${updateExpressions}`,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: 'ALL_NEW',
      }),
    );

    return this.findOne(id);
  }

  /** Delete a check‑in record */
  async remove(id: string): Promise<{ deleted: boolean }> {
    await this.dynamoRepository.send(
      new DeleteCommand({ TableName: this.tableName, Key: { id } }),
    );
    return { deleted: true };
  }

  /** Get logs with optional filters (same logic as before) */
  async getLogs(filter: CheckInFilterDto): Promise<CheckInRecord[]> {
    const result = await this.dynamoRepository.send(
      new ScanCommand({ TableName: this.tableName }),
    );
    const records = (result.Items ?? []) as CheckInRecord[];

    const { userId, storeId, from, to } = filter;
    const fromDate = from ? new Date(from) : undefined;
    const toDate = to ? new Date(to) : undefined;

    return records.filter(rec => {
      if (userId && rec.userId !== userId) return false;
      if (storeId && rec.storeId !== storeId) return false;
      const recDate = new Date(rec.timestamp);
      if (fromDate && recDate < fromDate) return false;
      if (toDate && recDate > toDate) return false;
      return true;
    });
  }
}