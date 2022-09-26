import { Body, Controller, Post } from '@nestjs/common';

@Controller('auth-controller')
export class AuthControllerController {
  @Post()
  register(@Body() register: { user: string }): any {
    return register;
  }
}
