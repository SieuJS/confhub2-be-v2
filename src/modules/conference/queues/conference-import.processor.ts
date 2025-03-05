import { Processor, WorkerHost } from "@nestjs/bullmq";
import { ConferenceQueueName } from "../constants/conference-queue-name";
import { LoggerService } from "../../common";
import { Job } from "bullmq";
import { ConferenceImportDTO } from "../models/conference/conference-import.dto";
import { ConferenceQueueJobName } from "../constants/conference-queue-job-name";
import { ConferenceService } from "../services/conference.service";
import { SourceService } from "../../source-rank/services/source.service";
import { RankService } from "../../source-rank/services/rank.service";
import { RankInputDTO } from "../../source-rank/models/rank-input.dto";
import { FieldOfResearchService } from "../../source-rank/services/field-of-research.service";
import { Injectable } from "@nestjs/common";
import { ConferenceImportGateway } from "../gateways/conference-import.gateway";

@Injectable ()
@Processor(ConferenceQueueName.TO_IMPORT) 
export class ConferenceImportProcessor extends WorkerHost {

    constructor(
        private loggerService : LoggerService,
        private conferenceService : ConferenceService,
        private sourceService : SourceService,
        private rankService : RankService,
        private fieldOfResearch : FieldOfResearchService,
        private socketService : ConferenceImportGateway
    ) {
        super();
    }

    async process(job : Job<ConferenceImportDTO, any, string> , token : string) {
        switch(job.name) {
            case ConferenceQueueJobName.IMPORT_CONFERENCE : 
                this.loggerService.info(`Importing conference ${JSON.stringify(job.data)}`);
                await this.importTheConference(job.data);
                await this.onCompleted(job, token);

                break;
            case ConferenceQueueJobName.NOTIFTY_CONFERENCE_IMPORT :
                this.loggerService.info(`Notifying conference import`);
                break;
            default :
                this.loggerService.error(`Unknown job name ${job.name}`);
                break;
        }
        
        return job.data;
    }

    async importTheConference(conference : ConferenceImportDTO) {
        const conferenceInstance = await this.conferenceService.findOrCreateConference(conference);
        const sourceIntance = await this.sourceService.findOrCreateSource({
                name : conference.source ,
                link : ''
        })
        const rankInput : RankInputDTO = {
            name : conference.rank , 
            source : sourceIntance,
            value : 0
        }

        const rankInstance = await this.rankService.findOrCreateRank(rankInput)
        conference.fieldOfResearchCodes.forEach(async code => {
            const fieldOfResearch = await this.fieldOfResearch.getFieldOfResearchByCode(code);
            if(fieldOfResearch) {
                await this.conferenceService.createConferenceRank(conferenceInstance.id,rankInstance, fieldOfResearch.id , conference.year);
            }
        });
    }

    async onCompleted(job : Job<ConferenceImportDTO, any, string> , token : string) {
        this.socketService.server.emit('conference-import', {payload : {
            conferenceId : job.data.id,
            status : 'IMPORTED',
        } });
    }
}