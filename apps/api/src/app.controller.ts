import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): { message: string } {
    // 修改回傳的型別
    // return this.appService.getHello();
    return { message: '嗨，我是從 NestJS 後端來的！👋' }; // 回傳一個物件
  }
}
