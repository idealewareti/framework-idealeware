import { Injectable } from "@angular/core";
import { HttpClientHelper } from "../helpers/http.helper";
import { ShowCase } from "../models/showcase/showcase";
import { environment } from "../../environments/environment";

@Injectable()
export class ShowCaseService{

    constructor(private client: HttpClientHelper){}

    getShowCase() : Promise<ShowCase>{
   		return new Promise((resolve, reject) => {
            let url = `${environment.API_SHOWCASE}/showcases`;
            let showcase = new ShowCase();
            this.client.get(url)
            .map(res => res.json())
            .subscribe(response => {
                let showcase = new ShowCase(response);
                resolve(showcase);
            }, error => {
                console.log(error);
                reject(error);
            });
        });
    }
}