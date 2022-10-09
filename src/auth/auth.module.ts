import { Module } from '@nestjs/common';
import { AuthService } from './service/auth/auth.service';
import { AuthController } from './controller/auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { User } from './domain/model/user.entity';
import { UserRepository } from './domain/repository/user.repository';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GoogleStrategy } from './config/strategies/google.strategy';
import { TokenGeneratorService } from './service/token-generator/token-generator.service';
import { JwtStrategy } from './config/strategies/jwt.strategy';
import { RefreshTokenStrategy } from './config/strategies/refresh-token.strategy';

@Module({
  imports: [
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get('JWT_ACCESS_SECRET'),
          signOptions: {
            expiresIn: 3600,
          },
        };
      },
    }),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserRepository,
    GoogleStrategy,
    JwtStrategy,
    RefreshTokenStrategy,
    TokenGeneratorService,
  ],
  exports: [GoogleStrategy, PassportModule, JwtStrategy, RefreshTokenStrategy],
})
export class AuthModule {}
