import { Repository, EntityRepository } from 'typeorm';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { User } from './user.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<any> {
    const { username } = authCredentialsDto;

    const user = new User();
    user.username = username;
    try {
      let user1 = await user.save();
      return {
        result: user1.username,
        statusCode: 200,
        message: `${user1.username} created successfully`,
      };
      debugger;
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        // duplicate username
        throw new ConflictException('Username already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
