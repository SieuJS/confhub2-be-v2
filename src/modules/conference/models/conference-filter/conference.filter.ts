import { ApiProperty, PartialType } from "@nestjs/swagger";

export class ConferenceFilter {
    @ApiProperty({
        description : "The conference name",
        required : false,
        default : ""
    })
    title? : string; 

    @ApiProperty({
        description : "The conference acronym",
        required : false,
        default : ""
    })
    acronym? : string;

    @ApiProperty({
        description : "The conference start date",
        required : false,
    })
    fromDate? : Date;

    @ApiProperty({
        description : "The conference end date",
        required : false,
    })
    toDate? : Date;

    @ApiProperty({
        description : "The topics of the conference",
        required : false,
        isArray : true,
    })
    topics? : string[]; 

    @ApiProperty({
        description : "The city of conference", 
        required : false
    })
    cityStateProvince? : string;

    @ApiProperty({
        description : "The country of conference",
        required : false
    })
    country? : string;

    @ApiProperty({
        description : "The conference continent",
        required : false
    })
    continent? : string;

    @ApiProperty({
        description : "The address of conference",
        required : false
    })
    address? : string;

    @ApiProperty({
        description : "The field of researches" , 
        required : false,
        isArray : true
    })
    researchFields? : string[];

    @ApiProperty({
        description : "The confeerence rank" , 
        required : false
    })
    rank? : string; 

    @ApiProperty({
        description : "The conference source",
        required : false
    })
    source? : string;

    @ApiProperty({
        description : "The conference type",
        required : false
    })
    accessType? : string;
}