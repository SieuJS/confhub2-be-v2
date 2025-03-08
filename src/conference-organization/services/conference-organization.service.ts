import { PrismaService } from "src/modules/common";

export class ConferenceOrganizationSerivce {
    constructor (
        private prismaService : PrismaService
    ){}

    async importPlace() {
        return await this.prismaService.conferenceOrganizations.findMany(
            {
                where : {
                    
                }
            }
        )
    }


}