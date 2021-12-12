import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SubscriptionRepository } from './subscription.repository';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { Subscription } from './subscription.entity';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(SubscriptionRepository)
    private subscriptionRepository: SubscriptionRepository,
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
}
