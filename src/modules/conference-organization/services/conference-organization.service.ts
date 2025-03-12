import { PrismaService } from "../../common";
import { LocationInput } from "../models/location/location.input";
import { LocationDTO } from "../models/location/location.dto";
import { ConferenceDateInput } from "../models/date/conferencer-date.input";
import { ConferenceDateDTO } from "../models/date/conference-date.dto";
import { OrganizedInput } from "../models/organize/organized.input";
import { OrganizedDTO } from "../models/organize/organized.dto";
import { Injectable } from "@nestjs/common";

@Injectable()
export class ConferenceOrganizationSerivce {
    constructor (
        private prismaService : PrismaService
    ){}

    async importPlace(input : LocationInput) : Promise<LocationDTO> {
        const location = await this.prismaService.locations.create({
            data : {
                continent : input.continent,
                country : input.country,
                cityStateProvince : input.cityStateProvince,
                address : input.address,
                organizeId : input.organizeId,
                isAvailable : true
            }
        })
        return location;
    }

    async importDate(input : ConferenceDateInput) : Promise<ConferenceDateDTO> {
        const date = await this.prismaService.conferenceDates.create({
            data : {
                fromDate : input.fromDate,
                toDate : input.toDate,
                organizedId : input.organizedId,
                type : input.type,
                name : input.name,
                isAvailable : true
            }
        })
        return date;
    }

    async importOrganize(input : OrganizedInput) : Promise<OrganizedDTO> {
        const organize = await this.prismaService.conferenceOrganizations.create({
            data : {
                year    : input.year,
                accessType : input.accessType,
                link : input.link,
                impLink : input.impLink,
                isAvailable : true,
                cfpLink : input.cfpLink,
                summerize : input.summerize,
                callForPaper : input.callForPaper,
                conferenceId : input.conferenceId,
                topics : input.topics
                
            }
        })
        return organize;
    }

    async getOrganizationsByConferenceId(conferenceId : string) {
        return this.prismaService.conferenceOrganizations.findMany({
            where : {
                isAvailable : true,
                conferenceId
            },
            orderBy : {
                
            }
        });
    }


}