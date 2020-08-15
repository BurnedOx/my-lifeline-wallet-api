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
Object.defineProperty(exports, "__esModule", { value: true });
exports.EPin = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("./base.entity");
const user_entity_1 = require("./user.entity");
let EPin = (() => {
    let EPin = class EPin extends base_entity_1.Base {
        static getAll() {
            return this.createQueryBuilder("epin")
                .leftJoinAndSelect("epin.owner", "owner")
                .orderBy("epin.createdAt", "DESC")
                .getMany();
        }
        static getUsed() {
            return this.createQueryBuilder("epin")
                .leftJoinAndSelect("epin.owner", "owner")
                .where("owner.epin IS NOT NULL")
                .orderBy("epin.createdAt", "DESC")
                .getMany();
        }
        static getUnused() {
            return this.createQueryBuilder("epin")
                .leftJoinAndSelect("epin.owner", "owner")
                .where("owner IS NULL")
                .orderBy("epin.createdAt", "DESC")
                .getMany();
        }
        toResponseObject() {
            const { id, createdAt, updatedAt } = this;
            const owner = this.owner ? { id: this.owner.id, name: this.owner.name } : null;
            const status = owner === null ? 'unused' : 'used';
            return { id, owner, status, createdAt, updatedAt };
        }
    };
    __decorate([
        typeorm_1.OneToOne(type => user_entity_1.User, user => user.epin, { nullable: true, onDelete: 'SET NULL' }),
        __metadata("design:type", user_entity_1.User)
    ], EPin.prototype, "owner", void 0);
    EPin = __decorate([
        typeorm_1.Entity()
    ], EPin);
    return EPin;
})();
exports.EPin = EPin;
//# sourceMappingURL=epin.entity.js.map