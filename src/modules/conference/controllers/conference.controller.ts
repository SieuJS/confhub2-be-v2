import { Body, Controller, Get, Post } from "@nestjs/common";
import { ConferenceService } from "../services/conference.service";
import { ApiBody, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ConferencePaginationDTO } from "../models/conference/conference-pagination.dto";
import { ConferenceImportDTO } from "../models/conference/conference-import.dto";
import {
    RankService,
    SourceService,
    FieldOfResearchService,
} from "../../source-rank";
import { RankInputDTO } from "src/modules/source-rank/models/rank-input.dto";
import { ConferenceImportResponseDTO } from "../models/conference-response/conference-import-response.dto";
import { ConferenceCrawlInputDTO } from "../models/conference-crawl/conference-crawl";
import { ConferenceCrawlJobService } from '../../conference-job'

@ApiTags("/conference")
@Controller("conference")
export class ConferenceController {
    constructor(
        private readonly conferenceService: ConferenceService,
        private readonly rankService: RankService,
        private readonly sourceService: SourceService,
        private readonly fieldOfResearch: FieldOfResearchService,
        private readonly conferenceCrawlJobService : ConferenceCrawlJobService
    ) {}

    @ApiResponse({
        status: 200,
        description: "Get all conferences",
        type: ConferencePaginationDTO,
        isArray: true,
    })
    @Get()
    async getConferences() {
        return await this.conferenceService.getConferences();
    }

    @ApiResponse({
        status: 200,
        description: "Import conferences",
        type : ConferenceImportResponseDTO  
    })
    @ApiBody({
        type: ConferenceImportDTO,
    })
    @Post("import")
    async importConferences(@Body() conferenceImport: ConferenceImportDTO) : Promise<ConferenceImportResponseDTO> {
        let isExists = true;
        let conferenceInstance =
            await this.conferenceService.getConferenceByAcronymAndTitle(
                conferenceImport.title,
                conferenceImport.acronym
            );

        if (!conferenceInstance) {
            isExists = false;
            conferenceInstance = await this.conferenceService.createConference(
                conferenceImport
            );
        }

        const sourceIntance = await this.sourceService.findOrCreateSource({
            name: conferenceImport.source,
            link: "",
        });

        const rankInput: RankInputDTO = {
            name: conferenceImport.rank,
            source: sourceIntance,
            value: 0,
        };

        const rankInstance = await this.rankService.findOrCreateRank(rankInput);
        conferenceImport.fieldOfResearchCodes.forEach(async (code) => {
            const fieldOfResearch =
                await this.fieldOfResearch.getFieldOfResearchByCode(code);
            if (fieldOfResearch) {
                await this.conferenceService.createConferenceRank(
                    conferenceInstance.id,
                    rankInstance,
                    fieldOfResearch.id,
                    conferenceImport.year
                );
            }
        });

        const JobCrawlInstance = await this.conferenceCrawlJobService.createConferenceCrawlJob({
            conferenceId : conferenceInstance.id,
            conferenceAcronym : conferenceImport.acronym,
            conferenceTitle : conferenceImport.title,
        })

        return {
            crawlJobId : JobCrawlInstance.id,
            conferenceId: conferenceInstance.id,
            isExists,
        };
    }

    @Post('crawl')
    @ApiBody({
        type : ConferenceCrawlInputDTO
    })
    async crawlConferences(@Body() conferenceCrawl : ConferenceCrawlInputDTO) {
        
    }
}
