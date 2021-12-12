import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@Injectable()
export class AuthService {
  private logger = new Logger('AuthService');

  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {}

  async signUp(userName: AuthCredentialsDto): Promise<void> {
    return this.userRepository.signUp(userName);
  }

  async getUserByUserName(userName: AuthCredentialsDto): Promise<void> {
    return this.userRepository.getUserByUserName(userName);
  }
}
