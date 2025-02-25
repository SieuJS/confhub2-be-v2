import { Module } from '@nestjs/common';

import { CommonModule } from './common';
import { PassengerModule } from './passenger/passenger.module';
import { ConferencesModule } from './conference/conference.module';
import { SourceRankModule } from './source-rank/source-rank.module';
import { UserModule } from './user/user.module';

@Module({
    imports: [
        CommonModule,
        PassengerModule,
        ConferencesModule,
        SourceRankModule,
        UserModule
    ]
})
export class ApplicationModule {
    
}

