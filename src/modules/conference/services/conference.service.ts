import { Conferences } from "@prisma/client";
import { PrismaService } from "../../common";
import { Injectable } from "@nestjs/common";

@Injectable()
export class ConferenceService {
    constructor (
        private readonly prismaService : PrismaService
    ){
        
    }

    async getConferences() {
        return await this.prismaService.conferences.findMany({});
    }

    async getConferenceById(id : string
    ) {
        return await this.prismaService.conferences.findUnique({
            where : {
                id
            }
        });
    }

    async importConferences(conference : Conferences) {
        return await this.prismaService.conferences.create({
            data : conference
        });
    }
}