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
exports.Rank = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("./base.entity");
const user_entity_1 = require("./user.entity");
let Rank = (() => {
    let Rank = class Rank extends base_entity_1.Base {
    };
    __decorate([
        typeorm_1.Column('text'),
        __metadata("design:type", String)
    ], Rank.prototype, "rank", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", Number)
    ], Rank.prototype, "income", void 0);
    __decorate([
        typeorm_1.ManyToOne(() => user_entity_1.User, user => user.ranks, { onDelete: 'CASCADE', nullable: false }),
        typeorm_1.JoinColumn(),
        __metadata("design:type", user_entity_1.User)
    ], Rank.prototype, "owner", void 0);
    __decorate([
        typeorm_1.OneToMany(() => user_entity_1.User, user => user.generatedRank, { onDelete: 'CASCADE' }),
        __metadata("design:type", Array)
    ], Rank.prototype, "direct", void 0);
    Rank = __decorate([
        typeorm_1.Entity()
    ], Rank);
    return Rank;
})();
exports.Rank = Rank;
//# sourceMappingURL=rank.entity.js.map