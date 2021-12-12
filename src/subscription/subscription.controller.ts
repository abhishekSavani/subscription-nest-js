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
  HttpStatus,
  ConflictException,
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

      let isPlanExist = await this.subscriptionService.checkPlanExistOrNot(
        createSubscriptionDto,
      );

      if (!isUserExist) {
        throw new NotFoundException({
          status: HttpStatus.NOT_FOUND,
          error: `${createSubscriptionDto.planId} user not exist..!`,
        });
      } else if (isPlanExist) {
        throw new ConflictException({
          status: HttpStatus.CONFLICT,
          error: `For date ${createSubscriptionDto.startDate} Plan already exist..!`,
        });
      } else {
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
    } catch (e) {
      if (e.status === 404) {
        throw new NotFoundException({
          status: HttpStatus.NOT_FOUND,
          error: `${createSubscriptionDto.planId} user not exist..!`,
        });
      } else if (e.status === 409) {
        throw new ConflictException({
          status: HttpStatus.CONFLICT,
          error: `For date ${createSubscriptionDto.startDate} Plan already exist..!`,
        });
      } else {
        throw new InternalServerErrorException();
      }
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
