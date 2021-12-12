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
    let isPastDate;
    try {
      // CASE1: Check user exist or not
      let isUserExist = await this.subscriptionService.isUserExist(
        createSubscriptionDto,
      );

      // CASE2: Check plan exist or not
      let isPlanExist = await this.subscriptionService.checkPlanExistOrNot(
        createSubscriptionDto,
      );

      //CASE3: check for historic date
      isPastDate = this.subscriptionService.isPastDate(createSubscriptionDto);

      if (!isUserExist) {
        throw new NotFoundException({
          status: HttpStatus.NOT_FOUND,
          error: `${createSubscriptionDto.userName} user not exist..!`,
        });
      } else if (isPlanExist) {
        throw new ConflictException({
          status: HttpStatus.CONFLICT,
          error: `For date ${createSubscriptionDto.startDate} Plan already exist..!`,
        });
      } else if (isPastDate) {
        throw new ConflictException({
          status: HttpStatus.CONFLICT,
          error: `You Can Not Subscribe Service For Past..!`,
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
      debugger;
      if (e.status === 404) {
        throw new NotFoundException({
          status: HttpStatus.NOT_FOUND,
          error: `${createSubscriptionDto.userName} user not exist..!`,
        });
      } else if (isPastDate) {
        throw new ConflictException({
          status: HttpStatus.CONFLICT,
          error: `You Can Not Subscribe Service For Past..!`,
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
  getSubscription(
    @Param('username') username: string,
    @Param('date') date?: string,
  ): Promise<void> {
    //CASE1:  user enter only start date. : Done

    //CASE2: user enter date which is between startdate and enddate
    return this.subscriptionService.getSubscription(username, date);
  }
}
