import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/modules/common";

@Injectable() 
export class ConferenceRankService {
    constructor(
        private prismaService : PrismaService
    ) {

    }
}