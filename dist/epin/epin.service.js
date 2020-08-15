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
exports.EpinService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const epin_entity_1 = require("../database/entity/epin.entity");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../database/entity/user.entity");
let EpinService = (() => {
    let EpinService = class EpinService {
        constructor(epinRepo, userRepo) {
            this.epinRepo = epinRepo;
            this.userRepo = userRepo;
        }
        async getAll(status) {
            let epins;
            if (status === 'used') {
                epins = await epin_entity_1.EPin.getUsed();
            }
            else if (status === 'unused') {
                epins = await epin_entity_1.EPin.getUnused();
            }
            else {
                epins = await epin_entity_1.EPin.getAll();
            }
            return epins.map(e => e.toResponseObject());
        }
        async getEpin(userId) {
            const user = await this.userRepo.findOne(userId);
            if (!user) {
                throw new common_1.HttpException('User not found', common_1.HttpStatus.NOT_FOUND);
            }
            const epins = await this.epinRepo.find({ relations: ['owner'] });
            const epin = epins.find(e => { var _a; return ((_a = e.owner) === null || _a === void 0 ? void 0 : _a.id) === user.id; });
            if (!epin) {
                throw new common_1.HttpException('Invalid E-Pin', common_1.HttpStatus.NOT_FOUND);
            }
            return epin.toResponseObject();
        }
        async generate() {
            const epin = await this.epinRepo.create();
            await this.epinRepo.save(epin);
            return epin.toResponseObject();
        }
    };
    EpinService = __decorate([
        common_1.Injectable(),
        __param(0, typeorm_1.InjectRepository(epin_entity_1.EPin)),
        __param(1, typeorm_1.InjectRepository(user_entity_1.User)),
        __metadata("design:paramtypes", [typeorm_2.Repository,
            typeorm_2.Repository])
    ], EpinService);
    return EpinService;
})();
exports.EpinService = EpinService;
//# sourceMappingURL=epin.service.js.map