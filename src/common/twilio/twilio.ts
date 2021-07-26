import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as client from 'twilio';

@Injectable()
export class TwilioHandler {
  private twilio: client.Twilio;
  constructor(private readonly config: ConfigService) {
    this.twilio = client(
      this.config.get('TWILIO_ACC_SID'),
      this.config.get('TWILIO_AUTH_TOKEN'),
    );
  }

  sendSMS(mobile: string, body: string) {
    return this.twilio.messages
      .create({
        to: `+91${mobile}`,
        from: this.config.get('TWILIO_NUMBER'),
        body,
      })
      .then(msg => msg.sid);
  }

  sendCode(mobile: string) {
    return this.twilio.verify
      .services(this.config.get('TWILIO_SERVICE_SID'))
      .verifications.create({ to: `+91${mobile}`, channel: 'sms' })
      .then(d => d.sid);
  }

  verify(code: string, mobile: string) {
    return this.twilio.verify
      .services(this.config.get('TWILIO_SERVICE_SID'))
      .verificationChecks.create({ to: `+91${mobile}`, code })
      .then(d => d.status === 'approved');
  }
}
