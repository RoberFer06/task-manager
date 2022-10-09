import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';

@Injectable()
export class TokenGeneratorService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async getTokens(
    email: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { email },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: this.configService.get<string>('JWT_ACCESS_TOKEN_EXPIRE'),
        },
      ),
      this.jwtService.signAsync(
        { email },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRE'),
        },
      ),
    ]);

    return { accessToken, refreshToken };
  }

  hashData(data: string) {
    return argon2.hash(data);
  }
}
