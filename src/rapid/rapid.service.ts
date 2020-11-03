import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import moment = require('moment');
import { Rapid } from 'src/database/entity/rapid.entity';
import { Transaction } from 'src/database/entity/transaction.entity';
import { User } from 'src/database/entity/user.entity';
import { EntityManager, getManager } from 'typeorm';

@Injectable()
export class RapidService {
    async findByUser(userId: string) {
        const rapid = await Rapid.findByOwner(userId);
        if (!rapid) {
            return null;
        }
        const [direct, count] = await User.findDirectForRapid(rapid.owner.id, rapid.startDate, rapid.endDate);
        const days = this.getDays(rapid.startDate, rapid.endDate);
        return { ...rapid, done: count, days, owner: undefined };
    }

    async newChallenge(owner: User, trx?: EntityManager) {
        const startDate = new Date();
        const endDate = new Date(moment().add(7, 'days').set('hours', 23).set('minutes', 59).set('seconds', 0).format())
        const challenge = Rapid.create({ startDate, endDate, owner });
        if (trx) {
            return trx.save(challenge);
        }
        return challenge.save();
    }

    @Cron('0 0 * * *', { timeZone: 'Asia/Calcutta' })
    checkForCompletion() {
        getManager().transaction(async trx => {
            console.log('Cron Executed');
            const incomplete = await Rapid.findIncompleteToday();
            const [completed, incomplete7days, incomplete30days] = await this.getCompleted(incomplete);
            console.log(completed, incomplete7days, incomplete30days)
            await this.handleCompletion(completed, trx).catch(e => console.log('comlpetion error', e));
            await this.handleConvertTo30(incomplete7days, trx).catch(e => console.log('30days error', e));
            await this.handleStartNew(incomplete30days, trx).catch(e => console.log('7days error', e));
        })
    }

    private async getCompleted(rapids: Rapid[]) {
        const completed: Rapid[] = [];
        const incomplete7days: Rapid[] = [];
        const incomplete30days: Rapid[] = [];
        for (let rapid of rapids) {
            const [directs, count] = await User.findDirectForRapid(rapid.owner.id, rapid.startDate, rapid.endDate);
            const days = this.getDays(rapid.startDate, rapid.endDate);
            if (rapid.target <= count) {
                completed.push(rapid);
            } else if (days === 7) {
                incomplete7days.push(rapid);
            } else if (days === 28) {
                incomplete30days.push(rapid);
            }
        }
        return [completed, incomplete7days, incomplete30days];
    }

    private async handleCompletion(rapids: Rapid[], trx: EntityManager) {
        if (rapids.length === 0)
            return;
        const toComplete = await Rapid.completeChallenges(rapids.map(r => r.id), trx);

        for (let rapid of toComplete) {
            console.log(rapid.owner)
            const owner = await User.creditBalance(rapid.owner.id, rapid.amount, trx);
            const transaction = Transaction.create({
                owner,
                amount: rapid.amount,
                currentBalance: owner.balance,
                type: 'credit',
                remarks: 'Rapid Challenge Bonus'
            });
            await trx.save(transaction);
            await this.newChallenge(owner, trx);
        }
    }

    private async handleConvertTo30(rapids: Rapid[], trx: EntityManager) {
        if (rapids.length === 0)
            return;
        const endDate = new Date(moment().add(21, 'days').set('hours', 23).set('minutes', 59).set('seconds', 0).format());
        await Rapid.updateToNext(rapids.map(r => r.id), endDate, trx);
    }

    private async handleStartNew(rapids: Rapid[], trx: EntityManager) {
        for (let rapid of rapids) {
            await this.newChallenge(rapid.owner, trx)
        }
    }

    private getDays(startDate: Date, endDate: Date) {
        const aDate = moment([startDate.getFullYear(), startDate.getMonth(), startDate.getDate()]);
        const bDate = moment([endDate.getFullYear(), endDate.getMonth(), endDate.getDate()]);
        return bDate.diff(aDate, 'days');
    }
}
