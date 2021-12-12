import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  Put,
  Param,
} from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Put('/user/:username')
  signUp(
    @Param('username', ValidationPipe) username: AuthCredentialsDto,
  ): Promise<void> {
    return this.authService.signUp(username);
  }
}
