import { Module } from '@nestjs/common';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionService } from './subscription.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionRepository } from './subscription.repository';
import { AuthService } from 'src/auth/auth.service';
import { UserRepository } from 'src/auth/user.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([SubscriptionRepository]),
    TypeOrmModule.forFeature([UserRepository]),
  ],
  controllers: [SubscriptionController],
  providers: [SubscriptionService, AuthService],
})
export class SubscriptionModule {}
