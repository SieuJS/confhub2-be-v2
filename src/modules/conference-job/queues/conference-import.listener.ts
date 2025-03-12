import { Processor , OnQueueEvent} from "@nestjs/bullmq";
import { CONFERENCE_QUEUE_NAME } from "src/constants/queue-name";

@Processor(CONFERENCE_QUEUE_NAME.CRAWL)
export class ConferenceImportConsumer {

    @OnQueueEvent('progress')
    onActive() {
        
    }
}