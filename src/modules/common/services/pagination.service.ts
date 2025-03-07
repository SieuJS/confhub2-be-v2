import { Injectable } from "@nestjs/common";
import { PaginationDTO } from "../model";

@Injectable()
export class PaginationService<T> {
    constructor() {

    }

    paginate(
        items : T[],
        page : number = 1,
        perPage : number = 10
    ) : {
        payload : T[],
        meta : PaginationDTO
    }{
        const start = (page - 1) * perPage;
        const end = start + perPage;
        const payload = items.slice(start, end);
        const totalPage = Math.ceil(items.length / perPage);
        const prevPage = page > 1 ? page - 1 : null;
        const nextPage = page < totalPage ? page + 1 : null;
        const meta : PaginationDTO = {
            page,
            perPage,
            totalPage,
            prevPage,
            nextPage
        }
        return {
            payload,
            meta
        }
    }

}