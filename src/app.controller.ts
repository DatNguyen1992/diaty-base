import { Controller, Get, Header, Res } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AppService } from './app.service';
import type { Response } from 'express';
import { welcomeHtml } from './app.html';

@Controller()
@ApiTags('Health-check')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Header('Content-Type', 'text/html')
  getHome(@Res() res: Response) {
    return res.type('text/html').send(welcomeHtml);
  }

  @Get()
  @Header('Content-Type', 'text/html')
  @ApiOperation({ summary: 'Welcome page' })
  getHello() {
    return welcomeHtml;
  }

  @Get('health')
  @ApiOperation({ summary: 'Check server health' })
  healthCheck() {
    return this.appService.healthCheck();
  }
}