import { Module, DynamicModule } from '@nestjs/common';
import { SNSModuleAsyncOptions } from 'src/interfaces';
import { CONFIG_CONNECTION_OPTIONS } from 'src/constraints';
import { AwsSnsService } from './services/aws.sns.service';

@Module({})
export class AwsModule {
    static forRootAsync(options: SNSModuleAsyncOptions): DynamicModule {
        return {
            module: AwsModule,
            providers: [
                {
                    provide: CONFIG_CONNECTION_OPTIONS,
                    useFactory: options.useFactory,
                    inject: options.inject || [],
                },
                AwsSnsService,
            ],
            exports: [AwsSnsService],
        };
    }
}
