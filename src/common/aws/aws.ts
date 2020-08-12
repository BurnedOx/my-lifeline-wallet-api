import { from } from "rxjs";
import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';

@Injectable()
export class AWSHandler {
    private readonly sns = new AWS.SNS({
        apiVersion: '2010-03-31',
        region: 'us-east-1',
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY,
    });

    async sendSMS(message: string, number: string, subject: string): Promise<any> {
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
}