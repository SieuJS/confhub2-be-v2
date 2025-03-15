import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../common";

@Injectable() 
export class ConferenceRankService {
    constructor(
        private prismaService : PrismaService
    ) {

    }

    async getRankByConferenceId(conferenceId : string) {
        return this.prismaService.conferenceRanks.findMany({
            where : {
                conferenceId
            },
            include : {
                inFieldOfResearch : true,
                byRank : {
                    include : {
                        belongsToSource : true
                    }
                }
            }
        })
    }
}