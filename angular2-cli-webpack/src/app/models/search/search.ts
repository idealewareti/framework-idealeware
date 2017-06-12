import { EnumSort } from "app/enums/sort.enum";
import { EnumSortPage } from "app/enums/sort-page.enum";

export class Search {
    name: string;
    categories: string[] = [];
    brands: string[] = [];
    variations: string[] = [];
    options: string[] = [];
    groups: string[] = [];
    sort: EnumSort;
    sortPage: EnumSortPage;

    constructor(search = null){
        if(search) return this.createFromResponse(search);
    }

    createFromResponse(response): Search{
        let model = new Search();

        for(let k in response){
           model[k] = response[k];
        }

        return model;
    }
}