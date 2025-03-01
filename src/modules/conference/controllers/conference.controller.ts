import { Body, Controller, Get, Post } from "@nestjs/common";
import { ConferenceService } from "../services/conference.service";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { ConferenceDTO } from "../models/conference/conference.dto";
import { ConferenceDtoToModelPipe } from "../pipes/conference-dto-to-model.pipe";
import { Conferences } from "@prisma/client";

@Controller('conference')
export class ConferenceController {
    constructor(
        private readonly conferenceService : ConferenceService
    ){
        
    }

    @ApiTags('/')
    @ApiResponse({status : 200, description : 'Get all conferences', type : ConferenceDTO, isArray : true})
    @Get()
    async getConferences() {
        return await this.conferenceService.getConferences();
    }

    @ApiTags('/import')
    @ApiResponse({status : 200, description : 'Import conferences', type : ConferenceDTO, isArray : true})
    @Post('import')
    async importConferences(@Body(ConferenceDtoToModelPipe) conference : Conferences) {
        return await this.conferenceService.importConferences(conference);
    }

    

}