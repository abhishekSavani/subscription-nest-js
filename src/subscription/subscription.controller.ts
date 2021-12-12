import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  Get,
  UsePipes,
  Param,
} from '@nestjs/common';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { GetSubscriptionDto } from './dto/get-subscription.dto';
import { Subscription } from './subscription.entity';
import { SubscriptionService } from './subscription.service';

@Controller('subscription')
export class SubscriptionController {
  constructor(private subscriptionService: SubscriptionService) {}

  @Post()
  @UsePipes(ValidationPipe)
  createSubscription(
    @Body() createSubscriptionDto: CreateSubscriptionDto,
  ): Promise<Subscription> {
    // Check user exist or not
    // check start date already exist or not
    const planInfo = this.subscriptionService.getAmountAsPerPlan(
      createSubscriptionDto.planId,
    );
    const endDate = this.subscriptionService.getPlanEndDate(
      createSubscriptionDto.startDate,
      planInfo.days,
    );
    return this.subscriptionService.saveSubscription(
      createSubscriptionDto,
      planInfo.cost,
      endDate,
    );
  }

  @Get('/:username/:date?')
  signUp(
    @Param('username') username: string,
    @Param('date') date?: string,
  ): Promise<void> {
    debugger;
    return this.subscriptionService.getSubscription(username, date);
  }
}
