import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../common";
import { RankInputDTO } from "../models/rank-input.dto";
import { RankDTO } from "../models/rank.dto";

@Injectable()
export class RankService { 
    private readonly prismaService : PrismaService;

    public async createRank (rank : RankInputDTO) : Promise<RankDTO> {
        const rankCreated =  await this.prismaService.ranks.create({
            data : {
                name : rank.name,
                value : rank.value,
                sourceId  : rank.source.id
            },include : {
                belongsTo: true
            }
        })
        return {
            id : rankCreated.id,
            name : rankCreated.name,
            value : rankCreated.value,
            source : rankCreated.belongsTo
        }

    }

    public async findOrCreateRank (rank : RankInputDTO) : Promise<RankDTO> {
        const existingRank = await this.prismaService.ranks.findFirst({
            where : {
                name : rank.name,
                value : rank.value,
                sourceId : rank.source.id
            },
            include : {
                belongsTo : true
            }
        })

        if(existingRank) {
            return {
                id : existingRank.id,
                name : existingRank.name,
                value : existingRank.value,
                source : existingRank.belongsTo
            }
        }

        return await this.createRank(rank);
    }
}