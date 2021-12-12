import { Repository, EntityRepository } from 'typeorm';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { User } from './user.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signUp(userName: AuthCredentialsDto): Promise<any> {
    const user = new User();
    user.username = userName.toString();
    try {
      let userObject = await user.save();
      return {
        result: userObject.username,
        statusCode: 200,
        message: `${userObject.username} created successfully`,
      };
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
