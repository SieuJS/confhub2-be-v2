import { InjectQueue } from "@nestjs/bullmq";
import { ConferenceQueueName } from "../constants/conference-queue-name";
import { Queue } from "bullmq";
import { ConferenceQueueJobName } from "../constants/conference-queue-job-name";
import { ConferenceImportDTO } from "../models/conference/conference-import.dto";
import { Injectable } from "@nestjs/common";

@Injectable()
export class ConferenceImportQueueService {

    constructor (
        @InjectQueue(ConferenceQueueName.TO_IMPORT) 
        private readonly conferenceImportQueue : Queue
    ){

    }

    async addConferenceToImportQueue(conferenceToImport : ConferenceImportDTO) {
        return await this.conferenceImportQueue.add(ConferenceQueueJobName.IMPORT_CONFERENCE,conferenceToImport )
    }

    async notyfyImportedConference() {
        return await this.conferenceImportQueue.add(ConferenceQueueJobName.NOTIFTY_CONFERENCE_IMPORT, {
            message : 'Conference imported successfully'
        })
    }
}