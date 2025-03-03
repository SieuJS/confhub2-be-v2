import { PickType } from "@nestjs/swagger";
import { ConferenceDTO } from "./conference.dto";

export class ConferenceImportDTO extends PickType(ConferenceDTO, [
    'title',
    'acronym',
    'source' , 
    'rank',
    'year',
    'fieldOfResearchCodes',
    'creatorId',
]) {

}