import { PrismaService } from "../../common";
import { Injectable } from "@nestjs/common";
import { ConferenceImportDTO } from "../models/conference/conference-import.dto";
import { RankDTO } from "../../source-rank/models/rank.dto";
import { ConferenceQueryDto } from "../models/conference/conference-query.dto";
import { PaginationService } from "../../common/services/pagination.service";
import { ConferenceFilter } from "../models/conference-filter/conference.filter";

@Injectable()
export class ConferenceService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly paginationService: PaginationService<any>
    ) {}

    async getConferences(conferenceFilter? : ConferenceFilter ) {

        const include = { 
            ranks: {
                include: {
                    byRank: {
                        include: {
                            belongsToSource: true,
                        },
                    },
                    inFieldOfResearch  : {
                        select : {
                            name : true
                        }
                    }
                },
            },
        }

        if(!conferenceFilter ) {
            return await this.prismaService.conferences.findMany({
                include
            });

        }

        const consferences = await this.prismaService.conferences.findMany({
            include , 
            where : {
                title : {
                    contains : conferenceFilter.title || "",
                    mode : "insensitive"
                },
                acronym : {
                    contains : conferenceFilter.acronym || "",
                    mode : "insensitive"
                },
                ranks : {
                    some : {
                        byRank : {
                            ...(conferenceFilter.rank ? {name : {
                                contains : conferenceFilter.rank || "",
                                mode : "insensitive"
                            }} : {}),
                            ...(conferenceFilter.source ?  {belongsToSource : {
                                name : {
                                    contains : conferenceFilter.source || "",
                                    mode : "insensitive"
                                }
                            }} : {})
                        }
                    }
                },
                organizations : {
                    some : {
                        ...(conferenceFilter.topics ? {topics : {
                            hasSome : conferenceFilter.topics
                        }} : {}
                        ),
                        locations : {
                            some : {
                                cityStateProvince : {
                                    contains : conferenceFilter.cityStateProvince || "",
                                    mode : "insensitive"
                                },
                                country : {
                                    contains : conferenceFilter.country || "", 
                                    mode : "insensitive"
                                },
                                continent : {
                                    contains : conferenceFilter.continent || "",
                                    mode : "insensitive"
                                },
                                address : {
                                    contains : conferenceFilter.address || "",
                                    mode : "insensitive"
                                }
                            }
                        },
                        conferenceDates : {
                            some : {
                                ...( conferenceFilter.fromDate ? {fromDate : {
                                    gte : conferenceFilter.fromDate
                                }} : {})    ,
                                ...( conferenceFilter.toDate ?  {toDate : {
                                    lte : conferenceFilter.toDate 
                                }} : {}) 
                            }
                        }
                    }
                }
            }
        });
        return consferences;
    }

    async getConferenceById(id: string) {
        return await this.prismaService.conferences.findUnique({
            where: {
                id,
            },
        });
    }

    async isExistsConferenceNameAndAcronym(title: string, acronym: string) {
        const conference = await this.prismaService.conferences.findFirst({
            where: {
                title,
                acronym,
            },
        });
        return conference ? true : false;
    }

    async createConference(conference: ConferenceImportDTO) {
        if (
            await this.isExistsConferenceNameAndAcronym(
                conference.title,
                conference.acronym
            )
        ) {
            throw new Error(
                `Conference with title ${conference.title} and acronym ${conference.acronym} already exists`
            );
        }

        return await this.prismaService.conferences.create({
            data: {
                title: conference.title,
                acronym: conference.acronym,
                creatorId: conference.creatorId,
                createdAt: new Date(),
                updatedAt: new Date
            }
        });
    }

    async findOrCreateConference(conference: ConferenceImportDTO) {
        const existingConference =
            await this.prismaService.conferences.findFirst({
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
                id: conference.id,
                title: conference.title,
                acronym: conference.acronym,
                creatorId: conference.creatorId,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        });
    }

    async importConferences(conference: ConferenceImportDTO) {
        const conferenceInstance = await this.findOrCreateConference(
            conference
        );

        
    }

    async createConferenceRank(
        conferenceId: string,
        rankInstance: RankDTO,
        fieldOfResearchId: string,
        year: number
    ) {
        return await this.prismaService.conferenceRanks.create({
            data: {
                conferenceId: conferenceId,
                rankId: rankInstance.id,
                fieldOfResearchId,
                year,
            },
        });
    }


    async queryConferences(query?: ConferenceQueryDto) {
        const { fromDate, toDate, page, perPage, ...restQuery } = query;
        const conferenceList = await this.prismaService.conferences.findMany({
            where: {
                title: {
                    contains: restQuery.title,
                    mode: "insensitive",
                },
                acronym: {
                    contains: restQuery.acronym,
                    mode: "insensitive",
                },
                ranks: {
                    some: {
                        byRank: {
                            name: {
                                contains: restQuery.rank,
                                mode: "insensitive",
                            },
                            belongsToSource: {
                                name: {
                                    contains: restQuery.source,
                                    mode: "insensitive",
                                },
                            },
                        },
                    },
                },
            },
            include: {
                ranks: {
                    include: {
                        byRank: {
                            include: {
                                belongsToSource: true,
                            },
                        },
                    },
                },
            },
        });
        return this.paginationService.paginate(conferenceList, page, perPage);
    }

    async getConferenceByAcronymAndTitle(title: string, acronym: string) {
        return await this.prismaService.conferences.findFirst({
            where: {
                title,
                acronym,
            },
        });
    }

    async createConferenceByImport(conferenceImport : ConferenceImportDTO) {
        return this.prismaService.conferences.create({
            data : {
                title: conferenceImport.title,
                acronym: conferenceImport.acronym,
                creatorId: conferenceImport.creatorId,
                createdAt: new Date(),
                updatedAt: new Date(),
            }
        });
    }
}
