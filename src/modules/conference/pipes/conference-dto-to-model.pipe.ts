import { PipeTransform, Injectable } from '@nestjs/common';
import { Conferences } from '@prisma/client';
import { ConferenceDTO } from '../models/conference/conference.dto';

@Injectable()
export class ConferenceDtoToModelPipe implements PipeTransform<ConferenceDTO, Conferences> {
    transform(value: ConferenceDTO): Conferences {
        const conference : Conferences = {
            id : value.id,
            title : value.title,
            acronym : value.acronym,
            creatorId : value.creatorId,
            createdAt : new Date(),
            updatedAt : new Date(),
        }
        return conference;
    }
}