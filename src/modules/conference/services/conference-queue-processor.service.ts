import { Processor, WorkerHost } from "@nestjs/bullmq";
import { ConferenceQueueName } from "../constants/conference-queue-name";
import { LoggerService } from "../../common";
import { Job } from "bullmq";
import { ConferenceImportDTO } from "../models/conference/conference-import.dto";
import { ConferenceQueueJobName } from "../constants/conference-queue-job-name";
import { ConferenceService } from "./conference.service";

@Processor(ConferenceQueueName.TO_IMPORT) 
export class ConferenceImportProcessor extends WorkerHost {
    private readonly loggerService : LoggerService;
    private readonly conferenceService :  ConferenceService ; 

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
        
    }
}