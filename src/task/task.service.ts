import { PagingQueryDTO } from '@common/dto/paging-query.dto';
import { Task } from '@entity/task.entity';
import { Transaction } from '@entity/transaction.entity';
import { User } from '@entity/user.entity';
import { Injectable } from '@nestjs/common';
import { TaskRO } from 'src/interfaces';
import { getManager } from 'typeorm';
import { CreateTaskDTO } from './task.dto';

@Injectable()
export class TaskService {
  async create(data: CreateTaskDTO) {
    const { amount, dueDate, userId } = data;
    const owner = await User.findOne(userId);
    const currentBalance = owner.balance + amount;
    const task = Task.create({
      amount,
      currentBalance,
      dueDate,
      owner,
    });
    const transaction = Transaction.create({
      amount,
      currentBalance,
      owner,
      type: 'credit',
      remarks: 'Credited for tasks',
    });
    await getManager().transaction(async trx => {
      owner.balance = currentBalance;
      await trx.save(owner);
      await trx.save(task);
      await trx.save(transaction);
    });
    return 'ok';
  }

  async get(
    userId: string,
    query: PagingQueryDTO,
  ): Promise<[TaskRO[], number]> {
    const [tasks, total] = await Task.findByOwnerId(userId, query);
    return [tasks.map(t => t.responseObject), total];
  }
}
