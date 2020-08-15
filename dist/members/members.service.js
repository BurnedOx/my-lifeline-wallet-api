"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MembersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("../database/entity/user.entity");
const typeorm_2 = require("typeorm");
let MembersService = (() => {
    let MembersService = class MembersService {
        constructor(userRepo) {
            this.userRepo = userRepo;
        }
        async updateSingleLeg() {
            const users = await this.userRepo.find({ where: { activatedAt: typeorm_2.Not(typeorm_2.IsNull()) } });
            await typeorm_2.getManager().transaction(async (trx) => {
                for (let user of users) {
                    const singleLegMembers = await this.getSingleLeg(user);
                    user.totalSingleLeg = singleLegMembers.length;
                    trx.save(user);
                }
            });
            return 'ok';
        }
        async directMembers(userId) {
            const user = await this.checkUser(userId);
            const members = await this.userRepo.find({
                where: { sponsoredBy: user },
                order: { createdAt: 'DESC' }
            });
            return members.map(member => member.toMemberObject(1));
        }
        async downlineMembers(userId) {
            const user = await this.checkUser(userId);
            return (await user_entity_1.User.getDownline(user))
                .map(({ member, level }) => member.toMemberObject(level));
        }
        async singleLegMembers(userId) {
            const user = await this.checkUser(userId);
            const members = await this.getSingleLeg(user);
            return members.map(m => m.toSingleLegMemberObject());
        }
        async checkUser(userId) {
            const user = await this.userRepo.findOne(userId, { relations: ['sponsored', 'sponsoredBy'] });
            if (!user) {
                throw new common_1.HttpException('Invalid userid', common_1.HttpStatus.NOT_FOUND);
            }
            return user;
        }
        async getSingleLeg(user) {
            if (user.activatedAt === null) {
                throw new common_1.HttpException('Inactive User', common_1.HttpStatus.BAD_REQUEST);
            }
            const allMembers = await this.userRepo.find({
                where: { activatedAt: typeorm_2.Not(typeorm_2.IsNull()) },
                order: { createdAt: 'DESC' },
            });
            return allMembers.filter(m => m.activatedAt.getTime() > user.activatedAt.getTime());
        }
    };
    MembersService = __decorate([
        common_1.Injectable(),
        __param(0, typeorm_1.InjectRepository(user_entity_1.User)),
        __metadata("design:paramtypes", [typeorm_2.Repository])
    ], MembersService);
    return MembersService;
})();
exports.MembersService = MembersService;
//# sourceMappingURL=members.service.js.map