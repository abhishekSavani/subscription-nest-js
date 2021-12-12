import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  Put,
  Param,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Put('/user/:username')
  signUp(
    @Param('username', ValidationPipe) username: AuthCredentialsDto,
  ): Promise<void> {
    return this.authService.signUp(username);
  }

  @Get('/user/:username')
  getUserByUserName(
    @Param('username', ValidationPipe) username: AuthCredentialsDto,
  ): Promise<void> {
    return this.authService.getUserByUserName(username);
  }
}
