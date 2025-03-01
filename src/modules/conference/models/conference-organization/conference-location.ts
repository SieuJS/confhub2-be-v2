import { ApiProperty } from "@nestjs/swagger";

export class ConferenceLocation {
    @ApiProperty({
        description : "address of conference location",
        example : "Paris"
    })
    address? : string

    @ApiProperty ({
        description : "City of conference location",
        example : "Paris"
    })
    city? : string

    @ApiProperty({
        description : "State of conference location",
        example : "LA"
    })
    state? : string

    @ApiProperty({
        description : "Country of conference location",
        example : "France"
    })
    country? : string

    @ApiProperty({
        description : "Full location", 
        example : "Paris, LA, France"
    })
    location : string

    @ApiProperty({
        description : "Is this location is available", 
        example : true
    })
    isAvailable : boolean

    @ApiProperty({
        description : "Created at",
        example : "2021-01-01T00:00:00.000Z"
    })
    createdAt : Date

    @ApiProperty({
        description : "Updated at",
        example : "2021-01-01T00:00:00.000Z"
    })
    updatedAt : Date
}