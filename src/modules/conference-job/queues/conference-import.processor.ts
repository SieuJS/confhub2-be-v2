import { Processor, WorkerHost } from "@nestjs/bullmq";
import { LoggerService } from "../../common";
import { Job } from "bullmq";
import { Injectable } from "@nestjs/common";
import { CONFERENCE_QUEUE_NAME } from "../../../constants/queue-name";
import { CONFERENCE_CRAWL_JOB_NAME} from "../../../constants/job-name";
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
            case CONFERENCE_CRAWL_JOB_NAME.CRAWL : 
                this.handleCrawlConferenceJob(job);
                break;
            case CONFERENCE_CRAWL_JOB_NAME.NOTIFY :
                this.loggerService.info(`Notifying conference import`);
                break;
            default :
                this.loggerService.error(`Unknown job name ${job.name}`);
                break;
        }
        
        return job.data;
    }

    async handleCrawlConferenceJob(job : Job<any, any, string>) {
        
    }


}