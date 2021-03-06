import { BaseEntity, Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Subscription extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  planId: string;

  @Column()
  startDate: string;

  @Column()
  endDate: string;

  @Column()
  amount: number;
}
