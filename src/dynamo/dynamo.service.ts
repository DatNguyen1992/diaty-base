import { Injectable, OnModuleInit } from '@nestjs/common';
import { DynamoDBClient, DescribeTableCommand, CreateTableCommand } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { ConfigService } from '@nestjs/config';
import { USER_TABLE_NAME } from './constants';

@Injectable()
export class DynamoDBService implements OnModuleInit {
  private client: DynamoDBClient;
  private docClient: DynamoDBDocumentClient;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    const region = this.configService.get<string>('database.awsRegion');
    const accessKeyId = this.configService.get<string>('database.awsAccessKeyId');
    const secretAccessKey = this.configService.get<string>('database.awsSecretAccessKey');

    this.client = new DynamoDBClient({
      region: region || 'ap-southeast-1',
      credentials: {
        accessKeyId: accessKeyId || '',
        secretAccessKey: secretAccessKey || '',
      },
    });

    this.docClient = DynamoDBDocumentClient.from(this.client);

    await this.ensureTableExists();
  }

  private async ensureTableExists() {
    const tableName = USER_TABLE_NAME;
    try {
      await this.client.send(new DescribeTableCommand({ TableName: tableName }));
    } catch (err: any) {
      if (err.name === 'ResourceNotFoundException' || err.$metadata?.httpStatusCode === 404) {
        await this.client.send(new CreateTableCommand({
          TableName: tableName,
          AttributeDefinitions: [{ AttributeName: 'id', AttributeType: 'S' }],
          KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
          BillingMode: 'PAY_PER_REQUEST',
        }));
      } else {
        throw err;
      }
    }
  }

  getClient(): DynamoDBClient {
    return this.client;
  }

  getDocClient(): DynamoDBDocumentClient {
    return this.docClient;
  }
}