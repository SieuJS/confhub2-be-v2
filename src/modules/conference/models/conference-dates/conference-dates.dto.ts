import { ApiProperty } from "@nestjs/swagger";

export class ConferenceDatesDTO {
    @ApiProperty({description : "Type of conference date", example : 'Submission'})
    type : 'Submission'  | 'Notification' | 'Camera Ready' | 'Conference' | 'Workshop' | 'Tutorial' | 'Deadline' | 'Other'

    @ApiProperty({description : "Date of conference date", example : '2021-01-01'})
    date : string
}