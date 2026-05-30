import { Injectable, NotFoundException } from '@nestjs/common';
import { DynamoRepository } from '../dynamo/dynamo.repository';
import { randomUUID } from 'crypto';
import {
  PutCommand,
  GetCommand,
  ScanCommand,
  UpdateCommand,
  DeleteCommand,
} from '@aws-sdk/lib-dynamodb';
import { STORE_TABLE_NAME } from '../dynamo/constants';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { Store } from './interfaces/store.interface';

@Injectable()
export class StoreService {
  private readonly tableName = STORE_TABLE_NAME;

  constructor(private readonly dynamoRepository: DynamoRepository) {}

  /** Create a new store */
  async create(dto: CreateStoreDto): Promise<Store> {
    const item: Store = {
      id: randomUUID(),
      name: dto.name,
      address: dto.address,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await this.dynamoRepository.send(
      new PutCommand({ TableName: this.tableName, Item: item }),
    );
    return item;
  }

  /** Retrieve all stores */
  async findAll(): Promise<Store[]> {
    const result = await this.dynamoRepository.send(
      new ScanCommand({ TableName: this.tableName }),
    );
    return (result.Items ?? []) as Store[];
  }

  /** Retrieve a single store by id */
  async findOne(id: string): Promise<Store> {
    const result = await this.dynamoRepository.send(
      new GetCommand({ TableName: this.tableName, Key: { id } }),
    );
    const store = result.Item as Store | undefined;
    if (!store) {
      throw new NotFoundException(`Store with ID ${id} not found`);
    }
    return store;
  }

  /** Update a store */
  async update(id: string, dto: UpdateStoreDto): Promise<Store> {
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

    // Update the updatedAt timestamp
    expressionAttributeNames[`#k${keys.length}`] = 'updatedAt';
    expressionAttributeValues[`:v${keys.length}`] = new Date().toISOString();

    await this.dynamoRepository.send(
      new UpdateCommand({
        TableName: this.tableName,
        Key: { id },
        UpdateExpression: `SET ${updateExpressions}, #k${keys.length} = :v${keys.length}`,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: 'ALL_NEW',
      }),
    );

    return this.findOne(id);
  }

  /** Delete a store */
  async remove(id: string): Promise<{ deleted: true }> {
    await this.dynamoRepository.send(
      new DeleteCommand({ TableName: this.tableName, Key: { id } }),
    );
    return { deleted: true };
  }
}