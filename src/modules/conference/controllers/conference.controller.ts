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
import { ConferenceOrganizationSerivce } from "../../conference-organization";
import { ConferenceDTO } from "../models/conference/conference.dto";
import { ConferenceAttribute } from "../../../constants/conference-attribute";
import { PaginationService } from "../../common/services/pagination.service";

@ApiTags("/conference")
@Controller("conference")
export class ConferenceController {
    constructor(
        private readonly conferenceService: ConferenceService,
        private readonly rankService: RankService,
        private readonly sourceService: SourceService,
        private readonly fieldOfResearch: FieldOfResearchService,
        private readonly conferenceCrawlJobService : ConferenceCrawlJobService,
        private readonly conferenceOrganizationService : ConferenceOrganizationSerivce,
        private readonly paginationService : PaginationService<ConferenceDTO>
    ) {}

    @ApiResponse({
        status: 200,
        description: "Get all conferences",
        type: ConferencePaginationDTO,
    })
    @Get()
    async getConferences() {
        const conferences =  await this.conferenceService.getConferences();
        const conferenceToResponse : ConferenceDTO[] = await Promise.all(conferences.map( async conference => {
            const organization = await this.conferenceOrganizationService.getFirstOrganizationsByConferenceId(conference.id) ;
            if(!organization) {
                return undefined;
            }
            const locations = await this.conferenceOrganizationService.getLocationsByOrganizedId(organization.id);
            const dates = await this.conferenceOrganizationService.getDatesByOrganizedId(organization.id);
            const conferenceDTO : ConferenceDTO = {
                id : conference.id,
                title : conference.title,
                acronym : conference.acronym,
                location : {
                    cityStateProvince : locations[0].cityStateProvince,
                    country : locations[0].country,
                    address : locations[0].address,
                    continent : locations[0].continent,
                },
                rank : conference.ranks[0].byRank.name,
                source : conference.ranks[0].byRank.belongsToSource.name,
                year : conference.ranks[0].year,
               researchFields: conference.ranks.map(rank => rank.inFieldOfResearch.name),
                topics : organization.topics,
                dates : dates.map(date => {
                    return {
                        name : date.name,
                        type : date.type,
                        fromDate : date.fromDate,
                        toDate : date.toDate,
                    }
                }
                ),
                link : organization.link,
                createdAt : conference.createdAt,
                updatedAt : conference.updatedAt,
                creatorId : conference.creatorId

            }
            return conferenceDTO;
        }))
        return this.paginationService.paginate(conferenceToResponse);
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
            status : ConferenceAttribute.JOB_STATUS_PENDING,
            progress : 0,
            message : 'pending'
        })

        return {
            crawlJobId : JobCrawlInstance.id,
            conferenceId: conferenceInstance.id,
            isExists,
            channel : "cfp-crawl-"+JobCrawlInstance.id
        };
    }

    @Post('crawl')
    @ApiBody({
        type : ConferenceCrawlInputDTO
    })
    async crawlConferences(@Body() conferenceCrawl : ConferenceCrawlInputDTO) {
        
    }
}
