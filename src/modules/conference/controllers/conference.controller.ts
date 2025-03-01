import { Body, Controller, Get, Post } from "@nestjs/common";
import { ConferenceService } from "../services/conference.service";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { ConferenceDtoToModelPipe } from "../pipes/conference-dto-to-model.pipe";
import { Conferences } from "@prisma/client";
import { ConferencePaginationDTO } from "../models/conference/conference-pagination.dto";
import { ConferenceImportDTO } from "../models/conference/conference-import.dto";

@ApiTags('/conference')
@Controller('conference')
export class ConferenceController {
    constructor(
        private readonly conferenceService : ConferenceService
    ){
        
    }

    @ApiResponse({status : 200, description : 'Get all conferences', type : ConferencePaginationDTO, isArray : true})
    @Get()
    async getConferences() {
        return await this.conferenceService.getConferences();
    }

    @ApiTags('/import')
    @ApiResponse({status : 200, description : 'Import conferences', type : ConferenceImportDTO, isArray : true})
    @Post('import')
    async importConferences(@Body(ConferenceDtoToModelPipe) conference : Conferences) {
        return await this.conferenceService.importConferences(conference);
    }

}