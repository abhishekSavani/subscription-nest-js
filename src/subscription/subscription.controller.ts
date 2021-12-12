import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  Get,
  UsePipes,
  Param,
  InternalServerErrorException,
  NotFoundException,
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
  async createSubscription(
    @Body() createSubscriptionDto: CreateSubscriptionDto,
  ): Promise<Subscription> {
    // Check user exist or not
    try {
      let isUserExist = await this.subscriptionService.isUserExist(
        createSubscriptionDto,
      );

      if (isUserExist) {
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
      } else {
        debugger;
        throw new NotFoundException();
      }
    } catch (e) {
      if (e.status === 404) throw new NotFoundException();
      throw new InternalServerErrorException();
    }
  }

  @Get('/:username/:date?')
  signUp(
    @Param('username') username: string,
    @Param('date') date?: string,
  ): Promise<void> {
    return this.subscriptionService.getSubscription(username, date);
  }
}
