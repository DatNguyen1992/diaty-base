import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { UploadModule } from './upload/upload.module';
import configuration from './config/configuration';
import { DynamoModule } from './dynamo/dynamo.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    UploadModule,
    DynamoModule,
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit {
  // constructor(private readonly dynamoDBService: DynamoDBService) {}

  onModuleInit() {
    // initAwsHelper(this.dynamoDBService);
  }
}
