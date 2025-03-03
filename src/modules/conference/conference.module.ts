import { Module } from '@nestjs/common';
import { ConferenceService } from './services/conference.service';
import { ConferenceController } from './controllers/conference.controller';
import { CommonModule } from '../common';
import { ConferenceDtoToModelPipe } from './pipes/conference-dto-to-model.pipe';
import { BullModule } from '@nestjs/bullmq';
import { ConferenceQueueName } from './constants/conference-queue-name';
import { ConferenceImportQueueService } from './services/conference-import-queue.service';
import { ConferenceImportProcessor } from './services/conference-import.processor';
import { SourceRankModule } from '../source-rank/source-rank.module';

@Module({
  imports : [CommonModule, BullModule.registerQueue({
    name : ConferenceQueueName.TO_IMPORT,
    prefix : ConferenceQueueName.TO_IMPORT_PREFIX
  }) , SourceRankModule ],
  providers: [ ConferenceService, ConferenceDtoToModelPipe,ConferenceImportQueueService, ConferenceImportProcessor],
  controllers: [ConferenceController],
})
export class ConferencesModule {}
