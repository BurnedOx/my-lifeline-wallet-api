import { Injectable } from '@nestjs/common';
import { EPin } from 'src/database/entity/epin.entity';
import { EpinHistory } from 'src/database/entity/epinHistory.entity';
import { User } from 'src/database/entity/user.entity';
import { EPinHistoryRO } from 'src/interfaces';
import { Between } from 'typeorm';

@Injectable()
export class EpinHistoryService {
  public createHistory(owner: User, epin: EPin, remark: string) {
    return EpinHistory.create({ owner, epin, remark });
  }

  async getAll(
    userId: string,
  ): Promise<EPinHistoryRO[]> {
    const history = await EpinHistory.getByUserId(userId);
    return history.map(h => h?.responseObject);
  }

  async getAdminHistory(
  ): Promise<EPinHistoryRO[]> {
    const history = await EpinHistory.getAdminHistory();
    return history.map(h => h?.responseObject);
  }

  public getTodaysRedeems(owner: User) {
    const [startOfToday, now] = this.getTimes();
    return EpinHistory.find({
      where: {
        owner,
        remark: 'Redeemed from wallet money',
        createdAt: Between(startOfToday, now),
      },
      relations: ['owner'],
    });
  }

  private getTimes() {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const localTime = new Date().toLocaleString('en-US', { timeZone });
    const startOfToday = new Date(localTime);
    startOfToday.setHours(0);
    startOfToday.setMinutes(0);
    startOfToday.setSeconds(0);
    startOfToday.setMilliseconds(0);

    return [startOfToday, localTime];
  }
}
