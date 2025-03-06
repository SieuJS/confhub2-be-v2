import { Module } from '@nestjs/common';
import { ConferenceService } from './services/conference.service';
import { ConferenceController } from './controllers/conference.controller';
import { CommonModule } from '../common';
import { ConferenceDtoToModelPipe } from './pipes/conference-dto-to-model.pipe';
import { SourceRankModule } from '../source-rank/source-rank.module';

@Module({
  imports : [CommonModule, SourceRankModule ],
  providers: [ ConferenceService, ConferenceDtoToModelPipe],
  controllers: [ConferenceController],
})
export class ConferencesModule {}
