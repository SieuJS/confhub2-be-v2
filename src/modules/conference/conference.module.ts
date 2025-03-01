import { Module } from '@nestjs/common';
import { ConferenceService } from './services/conference.service';
import { ConferenceController } from './controllers/conference.controller';
import { CommonModule } from '../common';
import { ConferenceDtoToModelPipe } from './pipes/conference-dto-to-model.pipe';
import { BullModule } from '@nestjs/bullmq';
import { ConferenceQueueName } from './constants/conference-queue-name';

@Module({
  imports : [CommonModule, BullModule.registerQueue({
    name : ConferenceQueueName.TO_IMPORT,
    prefix : ConferenceQueueName.TO_IMPORT_PREFIX
  })],
  providers: [ ConferenceService, ConferenceDtoToModelPipe],
  controllers: [ConferenceController],
})
export class ConferencesModule {}
