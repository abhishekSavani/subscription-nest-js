import { Repository, EntityRepository } from 'typeorm';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Subscription } from './subscription.entity';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';

@EntityRepository(Subscription)
export class SubscriptionRepository extends Repository<Subscription> {
  async createSubscription(
    createSubscriptionDto: CreateSubscriptionDto,
    amount: number,
    endDate: string,
  ): Promise<any> {
    const subscriptionData = new Subscription();

    subscriptionData.username = createSubscriptionDto.userName;
    subscriptionData.planId = createSubscriptionDto.planId;
    subscriptionData.startDate = new Date(createSubscriptionDto.startDate);
    subscriptionData.endDate = new Date(endDate);
    subscriptionData.amount = amount;
    debugger;
    try {
      let subscriptionObject = await subscriptionData.save();
      let obj = {} as any;
      obj.amount = `-${subscriptionObject.amount}`;
      obj.status = `SUCCESS`;
      debugger;
      return {
        result: obj,
        statusCode: 200,
        message: `Plan Subscribe Successfully`,
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
