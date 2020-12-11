import { PagingQueryDTO } from '@common/dto/paging-query.dto';
import { TaskRO } from 'src/interfaces';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Base } from './base.entity';
import { User } from './user.entity';

@Entity()
export class Task extends Base {
  @Column()
  amount: number;

  @Column({ default: 0 })
  currentBalance: number;

  @Column()
  dueDate: Date;

  @ManyToOne(
    () => User,
    user => user.tasks,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn()
  owner: User;

  public static findByOwnerId(userId: string, query: PagingQueryDTO) {
    return this.createQueryBuilder('task')
      .leftJoinAndSelect('task.owner', 'owner')
      .where('owner.id = :userId', { userId })
      .orderBy('task.dueDate', 'DESC')
      .offset(query.offset)
      .limit(query.limit)
      .getManyAndCount();
  }

  get responseObject(): TaskRO {
    return {
      id: this.id,
      amount: this.amount,
      currentBalance: this.currentBalance,
      dueDate: this.dueDate,
      owner: {
        id: this.owner.id,
        name: this.owner.name,
      },
      updatedAt: this.updatedAt,
      createdAt: this.createdAt,
    };
  }
}
