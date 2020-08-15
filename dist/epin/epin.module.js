"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EpinModule = void 0;
const common_1 = require("@nestjs/common");
const epin_controller_1 = require("./epin.controller");
const epin_service_1 = require("./epin.service");
const typeorm_1 = require("@nestjs/typeorm");
const epin_entity_1 = require("../database/entity/epin.entity");
const user_entity_1 = require("../database/entity/user.entity");
let EpinModule = (() => {
    let EpinModule = class EpinModule {
    };
    EpinModule = __decorate([
        common_1.Module({
            imports: [
                typeorm_1.TypeOrmModule.forFeature([epin_entity_1.EPin, user_entity_1.User])
            ],
            controllers: [epin_controller_1.EpinController],
            providers: [epin_service_1.EpinService]
        })
    ], EpinModule);
    return EpinModule;
})();
exports.EpinModule = EpinModule;
//# sourceMappingURL=epin.module.js.map