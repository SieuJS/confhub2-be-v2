import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';

import { CommonModule, Config } from './common';
import { PassengerModule } from './passenger/passenger.module';
import { ConferencesModule } from './conference/conference.module';
import { SourceRankModule } from './source-rank/source-rank.module';
import { UserModule } from './user/user.module';
import { Service } from './tokens';

@Module({
    imports:
    
    [
        CommonModule,
        BullModule.forRootAsync({
            imports : [CommonModule],
            inject: [Service.CONFIG],
            useFactory : async (config : Config) => ({
                connection : {
                    host : config.REDIS_HOST,
                    port : config.REDIS_PORT
                }
            })
        }),
        PassengerModule,
        SourceRankModule,
        UserModule,
        
        ConferencesModule
    ]
})
export class ApplicationModule {
    
}

