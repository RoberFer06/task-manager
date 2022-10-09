import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthCredentialDto } from '../../dto/auth-credential.dto';
import { UserRepository } from '../../domain/repository/user.repository';
import { User } from '../../domain/model/user.entity';
import { Auth, google } from 'googleapis';
import { ConfigService } from '@nestjs/config';
import { TokenGeneratorService } from '../token-generator/token-generator.service';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  private oauthClient: Auth.OAuth2Client;
  constructor(
    private userRepository: UserRepository,
    private tokenGeneratorService: TokenGeneratorService,
    private configService: ConfigService,
  ) {
    this.oauthClient = new google.auth.OAuth2(
      this.configService.get<string>('GOOGLE_CLIENT_ID'),
      this.configService.get<string>('GOOGLE_SECRET'),
    );
  }

  async signup(authCredentiaDto: AuthCredentialDto): Promise<void> {
    return this.userRepository.createUser(authCredentiaDto);
  }

  async signIn(
    authCredentiaDto: AuthCredentialDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { email, password } = authCredentiaDto;
    const user = await this.userRepository.findOneBy({ email });

    if (user && (await argon2.verify(password, user.password))) {
      const tokens = await this.tokenGeneratorService.getTokens(user.email);
      await this.updateRefreshToken(user.email, tokens.refreshToken);
      return tokens;
    } else throw new UnauthorizedException();
  }

  async loginGoogle(token: string): Promise<{ accessToken: string }> {
    const tokenInfo = await this.oauthClient.getTokenInfo(token).catch(() => {
      throw new ForbiddenException('Access Denied');
    });

    if (
      !(await this.userRepository.findOneBy({
        email: tokenInfo.email,
      }))
    ) {
      const authCredentiaDto: AuthCredentialDto = {
        email: tokenInfo.email,
        password: token,
      };
      this.signup(authCredentiaDto);
    }

    const tokens = await this.tokenGeneratorService.getTokens(tokenInfo.email);
    await this.updateRefreshToken(tokenInfo.email, tokens.refreshToken);
    return tokens;
  }

  async refreshTokens(
    email: string,
    refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.userRepository.findOneBy({ email });
    if (!user || !user.refreshToken)
      throw new ForbiddenException('Access Denied');
    const refreshTokenMatches = await argon2.verify(
      user.refreshToken,
      refreshToken,
    );

    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');

    const tokens = await this.tokenGeneratorService.getTokens(user.email);
    await this.updateRefreshToken(user.email, tokens.refreshToken);
    return tokens;
  }

  async updateRefreshToken(email: string, refreshToken: string) {
    const hashedRefreshToken = await this.tokenGeneratorService.hashData(
      refreshToken,
    );
    this.userRepository.update({ email }, { refreshToken: hashedRefreshToken });
  }

  async findByEmail(email: string): Promise<User> {
    return await this.userRepository.findOneBy({ email });
  }

  googleLogin(req: any) {
    if (!req.user) {
      return 'No user from google';
    }

    return {
      message: 'User information from google',
      user: req.user,
    };
  }
}
