import { ApiProperty } from "@nestjs/swagger";
import { ConferenceFilter } from "../conference-filter/conference.filter";

export class GetConferencesParams extends ConferenceFilter {
    @ApiProperty({
        description : "The page number",
        required : false
    })
    curPage? : number;

    @ApiProperty({
        description : "The page size",
        required : false
    })
    perPage? : number;
}