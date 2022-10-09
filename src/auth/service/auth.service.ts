import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthCredentialDto } from '../dto/auth-credential.dto';
import { UserRepository } from '../domain/repository/user.repository';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../config/jwt/jwt-payload-interface';
import { User } from '../domain/model/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private jwsService: JwtService,
  ) {}

  async signup(authCredentiaDto: AuthCredentialDto): Promise<void> {
    return this.userRepository.createUser(authCredentiaDto);
  }

  async signIn(
    authCredentiaDto: AuthCredentialDto,
  ): Promise<{ accessToken: string }> {
    const { username, password } = authCredentiaDto;
    const user = await this.userRepository.findOneBy({ username });

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayload = { username };
      const accessToken: string = await this.jwsService.sign(payload);
      return { accessToken };
    } else throw new UnauthorizedException('check your credentials');
  }

  async findByUsername(username: string): Promise<User> {
    return await this.userRepository.findOneBy({ username });
  }
}
