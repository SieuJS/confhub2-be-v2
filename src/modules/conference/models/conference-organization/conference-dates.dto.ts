import { ApiProperty } from "@nestjs/swagger";

export class ConferenceDatesDTO {
    @ApiProperty({description : "Type of conference date", example : 'SUBMISSION'})
    type : 'SUBMISSION'  | 'NOTIFICATION' | 'CAMERA READY' | 'CONFERENCE' | 'WORKSHOP' | 'TUTORIAL' | 'DEADLINE' | 'OTHER'

    @ApiProperty({description : "From date", example : '2021-01-01T00:00:00.000Z'})
    fromDate : Date

    @ApiProperty({description : "To date", example : '2021-01-01T00:00:00.000Z'})
    toDate : Date

    @ApiProperty({description : "Created at", example : '2021-01-01T00:00:00.000Z'})
    createdAt : Date

    @ApiProperty({description : "Updated at", example : '2021-01-01T00:00:00.000Z'})
    updatedAt : Date
}