"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AWSHandler = void 0;
const common_1 = require("@nestjs/common");
const AWS = require("aws-sdk");
let AWSHandler = (() => {
    let AWSHandler = class AWSHandler {
        constructor() {
            this.sns = new AWS.SNS({
                apiVersion: '2010-03-31',
                region: 'us-east-1',
                accessKeyId: process.env.AWS_ACCESS_KEY,
                secretAccessKey: process.env.AWS_SECRET_KEY,
            });
        }
        async sendSMS(message, number, subject) {
            var params = {
                Message: message,
                PhoneNumber: `+91${number}`,
                MessageAttributes: {
                    'AWS.SNS.SMS.SenderID': {
                        'DataType': 'String',
                        'StringValue': subject
                    }
                }
            };
            const msg = this.sns.publish(params)
                .promise()
                .then((data) => {
                return data;
            })
                .catch((err) => {
                console.error(err, err.stack);
                return false;
            });
            return msg;
        }
    };
    AWSHandler = __decorate([
        common_1.Injectable()
    ], AWSHandler);
    return AWSHandler;
})();
exports.AWSHandler = AWSHandler;
//# sourceMappingURL=aws.js.map