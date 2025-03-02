import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../common";
import { SourceInputDTO } from "../models/source-input.dto";
import { SourceDTO } from "../models/source.dto";

Injectable() 
export class SourceService {
    private readonly prismaService : PrismaService; 

    public createSource (source : SourceInputDTO) : Promise<SourceDTO> {
        return this.prismaService.sources.create ({
            data : source
        })
    }

    public async isExistSourceName (name : string) : Promise<boolean> {
        const source = await this.prismaService.sources.findUnique({
            where : {
                name
            }
        })
        return source ? true : false;
    }

}