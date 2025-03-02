import { Conferences } from "@prisma/client";
import { PrismaService } from "../../common";
import { Injectable } from "@nestjs/common";
import { ConferenceImportDTO } from "../models/conference/conference-import.dto";
import { ConferenceDTO } from "../models/conference/conference.dto";
import { RankDTO } from "../../source-rank/models/rank.dto";

@Injectable()
export class ConferenceService {
    constructor(private readonly prismaService: PrismaService) {}

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
            data: conference,
        });
    }

    async importConferences(conference: Conferences) {
        return await this.prismaService.conferences.create({
            data: conference,
        });
    }

    async createConferenceRank (conferenceInstance : ConferenceDTO, rankInstance : RankDTO, fieldOfResearchId : string , year : number) {
        return await this.prismaService.conferenceRanks.create ({
            data : {
                conferenceId : conferenceInstance.id ,
                rankId : rankInstance.id , 
                fieldOfResearchId ,
                year 
            }
        })
    }

}
