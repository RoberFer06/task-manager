import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { AuthCredentialDto } from '../../dto/auth-credential.dto';
import { User } from '../model/user.entity';
import * as argon2 from 'argon2';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async createUser(authCredentiaDto: AuthCredentialDto): Promise<void> {
    const { email, password } = authCredentiaDto;

    const hashPassword = await argon2.hash(password);

    const user = this.create({
      email,
      password: hashPassword,
    });

    try {
      await this.save(user);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('The user already exist');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
