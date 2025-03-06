import { Injectable } from "@nestjs/common";
import { ConferenceCrawlJobInputDTO } from "../models/conference-crawl-job/conference-crawl-job-input.dto";
import { PrismaService } from "../../common";

@Injectable() 
export class ConferenceImportService {
    constructor(
        private readonly prismaService : PrismaService
    ) {}   

    async addCrawlJob(
        job : ConferenceCrawlJobInputDTO
    ) {
        return await this.prismaService.conferenceCrawlJobs.create({
            data : {
                conferenceId : job.conferenceId ,
                status : job.status,
                createdAt : new Date(),
                updatedAt : new Date(),
                message : job.message,
                progress : job.progress,
            }
        });
    }
}