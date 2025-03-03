import { Body, Controller, Get, Post } from "@nestjs/common";
import { ConferenceService } from "../services/conference.service";
import { ApiBody, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ConferencePaginationDTO } from "../models/conference/conference-pagination.dto";
import { ConferenceImportDTO } from "../models/conference/conference-import.dto";
import { ConferenceImportQueueService } from "../services/conference-import-queue.service";

@ApiTags('/conference')
@Controller('conference')
export class ConferenceController {
    constructor(
        private readonly conferenceService : ConferenceService,
        private readonly conferenceImportQueueService : ConferenceImportQueueService
    ){
        
    }

    @ApiResponse({status : 200, description : 'Get all conferences', type : ConferencePaginationDTO, isArray : true})
    @Get()
    async getConferences() {
        return await this.conferenceService.getConferences();
    }

    @ApiResponse({status : 200, description : 'Import conferences', type : ConferenceImportDTO, isArray : true})
    @ApiBody({
        type : ConferenceImportDTO
    })
    @Post('import')
    async importConferences(@Body() conference : ConferenceImportDTO) {
        return await this.conferenceImportQueueService.addConferenceToImportQueue(conference);
    }
}