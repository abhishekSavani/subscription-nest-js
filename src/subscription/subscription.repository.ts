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

    try {
      let subscriptionObject = await subscriptionData.save();
      let obj = {} as any;
      obj.amount = `-${subscriptionObject.amount}`;
      obj.status = `SUCCESS`;

      return {
        result: obj,
        statusCode: 200,
        message: `Plan Subscribe Successfully`,
      };
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async getAllSubScription(userName, date) {
    let whereObj = {} as any;
    whereObj.username = userName.toString();

    if (date !== undefined) whereObj.startDate = date.toString();
    const subScriptionData: Subscription[] = await Subscription.find({
      where: whereObj,
    });
    return {
      result: subScriptionData,
      statusCode: 200,
      message: `Subscription Detail Fetch Successfully`,
    };
  }

  async getSubscription(userName, date): Promise<any> {
    let whereObj = {} as any;
    let finalResObj = {} as any;
    whereObj.username = userName.toString();
    if (date !== undefined) whereObj.startDate = date.toString();

    try {
      const subScriptionData: Subscription[] = await Subscription.find({
        where: whereObj,
      });

      if (date !== undefined)
        finalResObj = this.whenDateAvailable(subScriptionData[0]);
      return {
        result: finalResObj,
        statusCode: 200,
        message: `Subscription Detail Fetch Successfully`,
      };
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  whenDateAvailable(subscriptionData) {
    let resObj = {} as any;
    const oneDay = 24 * 60 * 60 * 1000;
    let endDate: any = new Date(subscriptionData.endDate);
    let currentDate: any = new Date();

    const diffDays = Math.round(Math.abs((currentDate - endDate) / oneDay));
    resObj.daysLeft = diffDays;
    resObj.planId = subscriptionData.planId;
    return resObj;
  }
}
