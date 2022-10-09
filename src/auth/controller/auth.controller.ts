import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from '../service/auth/auth.service';
import { AuthCredentialDto } from '../dto/auth-credential.dto';
import { AuthGuard } from '@nestjs/passport';
import { RefreshTokenGuard } from '../guards/refresh-token.guard';
import { GetUser } from '../get-user.decorator';
import { User } from '../domain/model/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  createUser(@Body() authCredentialDto: AuthCredentialDto): Promise<void> {
    return this.authService.signup(authCredentialDto);
  }

  @Post('/signin')
  singIn(
    @Body() authCredentialDto: AuthCredentialDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return this.authService.signIn(authCredentialDto);
  }

  @UseGuards(RefreshTokenGuard)
  @Post('/refresh-token')
  async refreshToken(
    @GetUser() user: User,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return await this.authService.refreshTokens(user.email, user.refreshToken);
  }

  @Post('/google/signin')
  singInGoogle(
    @Body() authCredentialDto: { token: string; refreshToken: string },
  ): Promise<{ accessToken: string }> {
    return this.authService.loginGoogle(authCredentialDto.token);
  }

  @Get()
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    console.log('google');
  }

  @Get('redirect')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req) {
    return this.authService.googleLogin(req);
  }
}
