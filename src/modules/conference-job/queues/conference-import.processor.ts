import { Processor, WorkerHost } from "@nestjs/bullmq";
import { LoggerService } from "../../common";
import { Job } from "bullmq";
import { Injectable } from "@nestjs/common";
import { ConferenceImportGateway } from "../gateways/conference-import.gateway";
import { CONFERENCE_QUEUE_NAME } from "../constants/queue-name";
import { JOB_NAME } from "../constants/job-name";
@Injectable ()
@Processor(CONFERENCE_QUEUE_NAME.CRAWL) 
export class ConferenceImportProcessor extends WorkerHost {

    constructor(
        private loggerService : LoggerService
    ) {
        super();
    }

    async process(job : Job<any, any, string> , token : string) {
        switch(job.name) {
            case JOB_NAME.CRAWL : 
                this.loggerService.info(`Importing conference ${JSON.stringify(job.data)}`);

                break;
            case JOB_NAME.NOTIFY :
                this.loggerService.info(`Notifying conference import`);
                break;
            default :
                this.loggerService.error(`Unknown job name ${job.name}`);
                break;
        }
        
        return job.data;
    }



}