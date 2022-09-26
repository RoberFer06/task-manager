import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  register(user: any): { user: string } {
    return user;
  }
}
