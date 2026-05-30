import { Module } from '@nestjs/common';
import { CheckInController } from './checkin.controller';
import { DynamoModule } from '../dynamo/dynamo.module';
import { CheckInService } from './checkin.service';

@Module({
  imports: [DynamoModule],
  controllers: [CheckInController],
  providers: [CheckInService],
  exports: [CheckInService],
})
export class CheckInModule {}