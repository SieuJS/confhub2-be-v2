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
}