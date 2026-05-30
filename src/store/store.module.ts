import { Module } from '@nestjs/common';
import { StoreController } from './store.controller';
import { DynamoModule } from '../dynamo/dynamo.module';
import { StoreService } from './store.service';

@Module({
  imports: [DynamoModule],
  controllers: [StoreController],
  providers: [StoreService],
  exports: [StoreService],
})
export class StoreModule {}