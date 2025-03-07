import { Module } from '@nestjs/common';
import { CommonModule } from '../common';
import { ConferencesModule } from '../conference/conference.module';
import { BullModule } from '@nestjs/bullmq';
import { CONFERENCE_QUEUE_NAME } from './constants/queue-name';

@Module({
    imports: [CommonModule, ConferencesModule, 
        BullModule.registerQueue({
            name : CONFERENCE_QUEUE_NAME.CRAWL
        })
    ],
    providers: [
        
    ],
    controllers: [],
})
export class ConferenceJobModule {
}
