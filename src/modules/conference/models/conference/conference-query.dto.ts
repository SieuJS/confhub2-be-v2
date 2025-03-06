import { ApiProperty, PickType } from "@nestjs/swagger";
import { ConferenceDTO } from "./conference.dto";

export class ConferenceQueryDto extends PickType(ConferenceDTO, [
    "title",
    "acronym",
    "source",
    "rank",
    "year",
    "fieldOfResearchCodes",
]) {
    @ApiProperty({ description: "From Date", type: Date, required: false })
    fromDate: Date;

    @ApiProperty({ description: "To Date", type: Date, required: false })
    toDate: Date;
}
 