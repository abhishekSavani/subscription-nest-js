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
    subscriptionData.startDate = createSubscriptionDto.startDate;
    subscriptionData.endDate = endDate;
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
      debugger;
      throw new InternalServerErrorException();
    }
  }

  async getSubscription(userName, date): Promise<any> {
    let whereObj = {} as any;
    whereObj.username = userName.toString();
    if (date !== undefined) whereObj.startDate = date.toString();

    try {
      const userData: Subscription[] = await Subscription.find({
        where: whereObj,
      });
      return {
        result: userData,
        statusCode: 200,
        message: `User Fetch Successfully`,
      };
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
