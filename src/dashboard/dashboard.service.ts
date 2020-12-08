import { Injectable } from '@nestjs/common';
import moment = require('moment');
import { EPIN_PRICE } from 'src/common/costraints';
import { EpinHistory } from 'src/database/entity/epinHistory.entity';
import { User } from 'src/database/entity/user.entity';
import { Withdrawal } from 'src/database/entity/withdrawal.entity';
import { AdminDashRO } from 'src/interfaces';
import { In } from 'typeorm';

@Injectable()
export class DashboardService {
  async getAdminDash(): Promise<AdminDashRO> {
    const totalMembers = await User.count({ where: { role: 'user' } });
    const activeMembers = await User.count({
      where: { status: 'active', role: 'user' },
    });
    const activationIncome = activeMembers * EPIN_PRICE;
    const purchasedEpins = await EpinHistory.count({
      where: { remark: In(['Purchased', 'Received from Admin']) },
    });
    const epinIncome = purchasedEpins * EPIN_PRICE;
    const [withdrawals, withdrawalCount] = await Withdrawal.findByStatus(
      'paid',
    );
    const totalWithdrawal =
      withdrawalCount !== 0
        ? withdrawals.map(w => w.withdrawAmount).reduce((a, b) => a + b)
        : 0;
    const [startDate, endDate] = this.getTimes();
    const joinedToday = (await User.findByJoiningDate(startDate, endDate))[1];
    const activatedToday = (
      await User.findByActivationDate(startDate, endDate)
    )[1];

    const [startDateWeek1, endDateWeek1] = this.get7DaysFrom(4);
    const [startDateWeek2, endDateWeek2] = this.get7DaysFrom(3);
    const [startDateWeek3, endDateWeek3] = this.get7DaysFrom(2);
    const [startDateWeek4, endDateWeek4] = this.get7DaysFrom(1);

    const activationWeekly = [
      (await User.findByActivationDate(startDateWeek1, endDateWeek1))[1],
      (await User.findByActivationDate(startDateWeek2, endDateWeek2))[1],
      (await User.findByActivationDate(startDateWeek3, endDateWeek3))[1],
      (await User.findByActivationDate(startDateWeek4, endDateWeek4))[1],
    ];
    const incomeWeekly = [
      await this.getTotalIncomeByDate(startDateWeek1, endDateWeek1),
      await this.getTotalIncomeByDate(startDateWeek2, endDateWeek2),
      await this.getTotalIncomeByDate(startDateWeek3, endDateWeek3),
      await this.getTotalIncomeByDate(startDateWeek4, endDateWeek4),
    ];
    const withdrawalWeekly = [
      await this.getPaidWithdrawalByDate(startDateWeek1, endDateWeek1),
      await this.getPaidWithdrawalByDate(startDateWeek2, endDateWeek2),
      await this.getPaidWithdrawalByDate(startDateWeek3, endDateWeek3),
      await this.getPaidWithdrawalByDate(startDateWeek4, endDateWeek4),
    ];
    return {
      totalMembers,
      activeMembers,
      activationIncome,
      epinIncome,
      totalWithdrawal,
      joinedToday,
      activationToday: activatedToday,
      activationWeekly,
      incomeWeekly,
      withdrawalWeekly,
    };
  }

  private async getPaidWithdrawalByDate(startDate: Date, endDate: Date) {
    return (
      await Withdrawal.findByStatusAndDate('paid', startDate, endDate)
    )[1];
  }

  private async getTotalIncomeByDate(startDate: Date, endDate: Date) {
    const activation = (await User.findByActivationDate(startDate, endDate))[1];
    const epinPurchase = (
      await EpinHistory.findPurchasedByDate(startDate, endDate)
    )[1];
    return (activation + epinPurchase) * EPIN_PRICE;
  }

  private getTimes() {
    const indiaTime = new Date().toLocaleString('en-US', {
      timeZone: 'Asia/Kolkata',
    });
    const now = new Date(indiaTime);
    const today = new Date(
      moment(now)
        .set('hours', 0)
        .set('minutes', 0)
        .set('minutes', 0)
        .format(),
    );
    const tomorrow = new Date(
      moment(today)
        .add(1, 'days')
        .format(),
    );

    return [today, tomorrow];
  }

  private get7DaysFrom(weeksAgo: number) {
    const indiaTime = new Date().toLocaleString('en-US', {
      timeZone: 'Asia/Kolkata',
    });
    const now = new Date(indiaTime);
    const startDate = new Date(
      moment(now)
        .set('hours', 0)
        .set('minutes', 0)
        .set('minutes', 0)
        .set('milliseconds', 0)
        .weekday(0)
        .subtract(weeksAgo, 'weeks')
        .format(),
    );
    const endDate = new Date(
      moment(startDate)
        .add(1, 'weeks')
        .format(),
    );

    return [startDate, endDate];
  }
}
