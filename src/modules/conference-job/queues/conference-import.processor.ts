import { Processor, WorkerHost } from "@nestjs/bullmq";
import { ConferenceQueueName } from "../constants/conference-queue-name";
import { LoggerService } from "../../common";
import { Job } from "bullmq";
import { ConferenceQueueJobName } from "../constants/conference-queue-job-name";
import { Injectable } from "@nestjs/common";
import { ConferenceImportGateway } from "../gateways/conference-import.gateway";
@Injectable ()
@Processor(ConferenceQueueName.TO_IMPORT) 
export class ConferenceImportProcessor extends WorkerHost {

    constructor(
        private loggerService : LoggerService
    ) {
        super();
    }

    async process(job : Job<any, any, string> , token : string) {
        switch(job.name) {
            case ConferenceQueueJobName.IMPORT_CONFERENCE : 
                this.loggerService.info(`Importing conference ${JSON.stringify(job.data)}`);

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



}