import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';

import { CommonModule, Config } from './common';
import { PassengerModule } from './passenger/passenger.module';
import { ConferencesModule } from './conference/conference.module';
import { SourceRankModule } from './source-rank/source-rank.module';
import { UserModule } from './user/user.module';
import { Service } from './tokens';
import { ConferenceJobModule } from './conference-job/conference-job.module';
import { SocketGatewayModule } from './socket-gateway/socket-gateway.module';
import { AuthModule } from './auth/auth.module';

@Module({
    imports:
    
    [
        CommonModule,
        BullModule.forRootAsync( {
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
        ConferenceJobModule,
        ConferencesModule,
        SocketGatewayModule,
        AuthModule
    ]
})
export class ApplicationModule {
    
}

