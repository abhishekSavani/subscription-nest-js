import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SubscriptionRepository } from './subscription.repository';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { Subscription } from './subscription.entity';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(SubscriptionRepository)
    private subscriptionRepository: SubscriptionRepository,
    private authService: AuthService,
  ) {}

  async saveSubscription(
    subscriptionDto: CreateSubscriptionDto,
    amount: number,
    endDate: string,
  ): Promise<Subscription> {
    return this.subscriptionRepository.createSubscription(
      subscriptionDto,
      amount,
      endDate,
    );
  }

  async getSubscription(userName, date): Promise<void> {
    return this.subscriptionRepository.getSubscription(userName, date);
  }

  getAmountAsPerPlan(planId) {
    switch (planId) {
      case 'FREE':
        return { cost: 0, days: -1 };
      case 'TRIAL':
        return { cost: 0, days: 7 };
      case 'LITE_1M':
        return { cost: 100, days: 30 };
      case 'PRO_1M':
        return { cost: 200, days: 30 };
      case 'LITE_6M':
        return { cost: 500, days: 180 };
      case 'PRO_6M':
        return { cost: 900, days: 180 };
      default:
        break;
    }
  }

  getPlanEndDate(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result.toISOString().split('T')[0];
  }

  isUserExist(subscriptionData) {
    // return this.authService.getUserByUserName(subscriptionData.userName);
    return new Promise(async (resolve, reject) => {
      try {
        let userData: any = await this.authService.getUserByUserName(
          subscriptionData.userName,
        );
        debugger;
        if (userData.result.username === subscriptionData.userName)
          resolve(true);
      } catch (e) {
        if (e.status === 404) resolve(false);
        reject(e);
      }
    });
  }
}
