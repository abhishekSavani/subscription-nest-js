import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  Get,
  UsePipes,
} from '@nestjs/common';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { Subscription } from './subscription.entity';
import { SubscriptionService } from './subscription.service';

@Controller('subscription')
export class SubscriptionController {
  constructor(private subscriptionService: SubscriptionService) {}

  @Post()
  @UsePipes(ValidationPipe)
  createTask(
    @Body() createSubscriptionDto: CreateSubscriptionDto,
  ): Promise<Subscription> {
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
}