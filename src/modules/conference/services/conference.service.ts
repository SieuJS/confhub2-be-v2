import { PrismaService } from "../../common";
import { Injectable } from "@nestjs/common";
import { ConferenceImportDTO } from "../models/conference/conference-import.dto";
import { RankDTO } from "../../source-rank/models/rank.dto";
import { RankInputDTO } from "src/modules/source-rank/models/rank-input.dto";
import { SourceService } from "../../source-rank/services/source.service";
import { RankService } from "../../source-rank/services/rank.service";
import { FieldOfResearchService } from "../../source-rank/services/field-of-research.service";

@Injectable()
export class ConferenceService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly sourceService : SourceService,
        private readonly rankService : RankService,
        private readonly fieldOfResearch : FieldOfResearchService
    ) {}

    async getConferences() {
        return await this.prismaService.conferences.findMany({});
    }

    async getConferenceById(id: string) {
        return await this.prismaService.conferences.findUnique({
            where: {
                id,
            },
        });
    }

    async isExistsConferenceNameAndAcronym( title : string , acronym : string) {
        const conference = await this.prismaService.conferences.findFirst({
            where : {
                title,
                acronym
            }
        });
        return conference ? true : false;
    }

    async createConference(conference : ConferenceImportDTO) {
        if(await this.isExistsConferenceNameAndAcronym(conference.title, conference.acronym)) {
            throw new Error(`Conference with title ${conference.title} and acronym ${conference.acronym} already exists`);
        }

        return await this.prismaService.conferences.create({
            data: conference,
        });
    }

    async findOrCreateConference(conference: ConferenceImportDTO) {
        const existingConference = await this.prismaService.conferences.findFirst({
            where: {
                title: conference.title,
                acronym: conference.acronym,
            },
        });

        if (existingConference) {
            return existingConference;
        }

        return await this.prismaService.conferences.create({
            data: {
                id : conference.id,
                title: conference.title,
                acronym: conference.acronym,
                creatorId: conference.creatorId,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        });
    }

    async importConferences(conference: ConferenceImportDTO) {
        const conferenceInstance = await this.findOrCreateConference(conference);

        const sourceIntance = await this.sourceService.findOrCreateSource({
                name : conference.source ,
                link : ''
        })

        const rankInput : RankInputDTO = {
            name : conference.rank , 
            source : sourceIntance,
            value : 0
        }

        const rankInstance = await this.rankService.findOrCreateRank(rankInput)
        conference.fieldOfResearchCodes.forEach(async code => {
            const fieldOfResearch = await this.fieldOfResearch.getFieldOfResearchByCode(code);
            if(fieldOfResearch) {
                await this.createConferenceRank(conferenceInstance.id,rankInstance, fieldOfResearch.id , conference.year);
            }
        });
    }

    async createConferenceRank (conferenceId : string, rankInstance : RankDTO, fieldOfResearchId : string , year : number) {
        return await this.prismaService.conferenceRanks.create ({
            data : {
                conferenceId : conferenceId,
                rankId : rankInstance.id, 
                fieldOfResearchId,
                year
            }
        })
    }

    async queryConferences (){}

}
