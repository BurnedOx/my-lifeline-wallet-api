import { PagingQueryDTO } from '@common/dto/paging-query.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AccountsService } from 'src/accounts/accounts.service';
import { EPIN_PRICE } from 'src/common/costraints';
import { EPin } from 'src/database/entity/epin.entity';
import { EpinHistory } from 'src/database/entity/epinHistory.entity';
import { User } from 'src/database/entity/user.entity';
import { UserEpin } from 'src/database/entity/userEpin.entity';
import { EpinHistoryService } from 'src/epin-history/epin-history.service';
import { UserEPinRO } from 'src/interfaces';
import { getManager } from 'typeorm';
import { SendEPinDTO } from './user-epin.dto';

@Injectable()
export class UserEpinService {
  constructor(
    private readonly historyService: EpinHistoryService,
    private readonly accountsService: AccountsService,
  ) {}

  async getById(
    userId: string,
    query?: PagingQueryDTO,
    status?: 'used' | 'unused',
  ): Promise<[UserEPinRO[], number]> {
    const [userEPins, count] = await UserEpin.getByUserId(
      userId,
      status,
      query,
    );
    return [userEPins.map(e => e.responseObject), count];
  }

  async sendToAnother(userId: string, data: SendEPinDTO) {
    const { sendTo, total } = data;
    const [availableEPins, availableCount] = await UserEpin.getByUserId(userId);

    if (availableCount < total) {
      throw new HttpException(
        `Not enought epins. Available E-Pins ${availableCount}`,
        HttpStatus.NOT_ACCEPTABLE,
      );
    }

    const receiver = await User.findOne(sendTo, {
      where: { status: 'active' },
    });
    const { id: senderId, name: senderName } = { ...availableEPins[0].owner };

    if (!receiver) {
      throw new HttpException(
        'Invalid userid to send to',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }

    const epinsToSend = availableEPins.slice(0, total);
    const senderHistory = epinsToSend.map(obj =>
      this.historyService.createHistory(
        obj.owner,
        obj.epin,
        `Sent to ${receiver.id} (${receiver.name})`,
      ),
    );
    epinsToSend.forEach(epin => (epin.owner = receiver));
    const receiverHistory = epinsToSend.map(obj =>
      this.historyService.createHistory(
        obj.owner,
        obj.epin,
        `Received from ${senderId} (${senderName})`,
      ),
    );

    await getManager().transaction(async trx => {
      await trx.save(epinsToSend);
      await trx.save(senderHistory);
      await trx.save(receiverHistory);
    });

    return epinsToSend.map(e => e.id);
  }

  async activateAccount(ownerId: string, userId: string) {
    const [availableEPins, count] = await UserEpin.getByUserId(ownerId);

    if (count < 1) {
      throw new HttpException('Not enought epin', HttpStatus.NOT_ACCEPTABLE);
    }

    const userEpin = availableEPins[0];
    const { id, epin, owner } = userEpin;
    const user = await this.accountsService.activateAccount(epin.id, userId);
    userEpin.status = 'used';
    const history = this.historyService.createHistory(
      owner,
      epin,
      `Activated account for ${user.id} (${user.name})`,
    );

    await getManager().transaction(async trx => {
      await trx.save(userEpin);
      await trx.save(history);
    });

    return id;
  }

  async sendFromAdmin(data: SendEPinDTO) {
    const { sendTo, total } = data;
    const epins = (await EPin.getUnused())[0];

    if (epins.length < total) {
      throw new HttpException('Not enough epin', HttpStatus.NOT_ACCEPTABLE);
    }

    const owner = await User.findOne(sendTo, { where: { status: 'active' } });

    if (!owner) {
      throw new HttpException(
        'Invalid userid to send to',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }

    const admin = (await User.find({ where: { role: 'admin' } }))[0];
    const epinToSend = epins.slice(0, total);
    const userEpins = epinToSend.map(epin => UserEpin.create({ owner, epin }));
    const histories = epinToSend.map(epin =>
      this.historyService.createHistory(owner, epin, `Received from Admin`),
    );
    const adminHistory = epinToSend.map(epin =>
      this.historyService.createHistory(
        admin,
        epin,
        `Sent to ${owner.id} (${owner.name})`,
      ),
    );

    await getManager().transaction(async trx => {
      await trx.save(userEpins);
      await trx.save(histories);
      await trx.save(adminHistory);
    });

    return epinToSend.map(epin => epin.id);
  }

  async redeemEpin(count: number, userId: string) {
    const owner = await User.findOne(userId);
    const totalCost = count * (EPIN_PRICE + EPIN_PRICE * 0.1);
    const epins: EPin[] = [];

    if (!owner) {
      throw new HttpException('Invalid user id', HttpStatus.NOT_FOUND);
    }

    if (owner.balance < totalCost) {
      throw new HttpException('Not enough balance', HttpStatus.NOT_ACCEPTABLE);
    }

    const todaysRedeems = await this.historyService.getTodaysRedeems(owner);

    if (todaysRedeems.length > 0) {
      throw new HttpException(
        'not more than one request per day',
        HttpStatus.BAD_REQUEST,
      );
    }

    await getManager().transaction(async trx => {
      for (let i = 0; i < count; i++) {
        const epin = EPin.create();
        await trx.save(epin);
        const userEpin = UserEpin.create({ owner, epin });
        await trx.save(userEpin);
        const history = this.historyService.createHistory(
          owner,
          epin,
          'Redeemed from wallet money',
        );
        await trx.save(history);
        epins.push(epin);
      }
      owner.balance -= totalCost;
      await trx.save(owner);
    });

    return epins.map(e => e.id);
  }

  public async purchaseEpins(userId: string, count: number) {
    const owner = await User.findOne(userId);
    if (!owner) {
      throw new HttpException('Invalid user id', HttpStatus.NOT_FOUND);
    }
    await getManager().transaction(async trx => {
      for (let i = 0; i < count; i++) {
        const epin = EPin.create();
        await trx.save(epin);
        const userEpin = UserEpin.create({ owner, epin });
        await trx.save(userEpin);
        const history = this.historyService.createHistory(
          owner,
          epin,
          'Purchased',
        );
        await trx.save(history);
      }
    });
  }
}
