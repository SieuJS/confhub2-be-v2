import { InjectQueue } from "@nestjs/bullmq";
import { ConferenceQueueName } from "../constants/conference-queue-name";
import { Queue } from "bullmq";

export class ConferenceImportNotifyService{
    constructor (
        @InjectQueue(ConferenceQueueName.TO_NOTITY_IMPORT)
        private notifyQueue : Queue,

    ) {}

    async notifyImportedConference(){
        await this.notifyQueue.add('notify-imported-conference', {
            message : 'Conference imported successfully'
        });
    }

    async notifyFailedImportConference(){
        await this.notifyQueue.add('notify-failed-import-conference', {
            message : 'Failed to import conference'
        });
    }

}