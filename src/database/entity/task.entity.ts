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
}
