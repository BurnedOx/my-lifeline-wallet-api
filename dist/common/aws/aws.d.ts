export declare class AWSHandler {
    private readonly sns;
    sendSMS(message: string, number: string, subject: string): Promise<any>;
}
