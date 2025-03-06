import { OmitType } from "@nestjs/swagger";
import { ConferenceCrawlJobDTO } from "./conference-crawl-job.dto";

export class ConferenceCrawlJobInputDTO extends OmitType(ConferenceCrawlJobDTO, [
    'id',
    'createdAt',
    'updatedAt',
]) {
    
}