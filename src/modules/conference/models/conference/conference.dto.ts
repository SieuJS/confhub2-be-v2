import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class ConferenceDTO {
    @ApiProperty({ description: 'Conference unique ID', example: '36635263' })
    @IsUUID('3')
    public readonly id: string;
}
