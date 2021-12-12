import { IsNotEmpty } from 'class-validator';

export class CreateSubscriptionDto {
  @IsNotEmpty()
  userName: string;

  @IsNotEmpty()
  planId: string;

  @IsNotEmpty()
  startDate: string;
}
