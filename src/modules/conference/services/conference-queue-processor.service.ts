import { Processor, WorkerHost } from "@nestjs/bullmq";
import { ConferenceQueueName } from "../constants/conference-queue-name";
import { LoggerService } from "../../common";
import { Job } from "bullmq";
import { ConferenceImportDTO } from "../models/conference/conference-import.dto";
import { ConferenceQueueJobName } from "../constants/conference-queue-job-name";
import { ConferenceService } from "./conference.service";
import { SourceService } from "../../source-rank/services/source.service";
import { RankService } from "../../source-rank/services/rank.service";
import { RankInputDTO } from "../../source-rank/models/rank-input.dto";

@Processor(ConferenceQueueName.TO_IMPORT) 
export class ConferenceImportProcessor extends WorkerHost {
    private readonly loggerService : LoggerService;
    private readonly conferenceService :  ConferenceService ; 
    private readonly sourceService : SourceService;
    private readonly rankService : RankService;

    async process(job : Job<ConferenceImportDTO, any, string> , token : string) {

        this.loggerService.info(`Processing job ${job.id} with data ${job.data}`);

        switch(job.name) {
            case ConferenceQueueJobName.IMPORT_CONFERENCE : 
                this.loggerService.info(`Importing conference ${job.data}`);
                break;
            default :
                this.loggerService.error(`Unknown job name ${job.name}`);
                break;
        }
        
        return job.data;
    }

    async importTheConference(conference : ConferenceImportDTO) {
        const conferenceInstance = await this.conferenceService.createConference(conference);

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
    }
}