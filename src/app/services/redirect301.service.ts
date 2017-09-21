import { Injectable } from "@angular/core";
import { HttpClient } from "app/helpers/httpclient";
import { NgProgressService } from "ngx-progressbar";
import { Redirect301Route } from "app/models/redirect301/redirect301-route";
import { AppSettings } from "app/app.settings";

@Injectable()
export class Redirect301Service{

    constructor(
        private client: HttpClient,
        private loader: NgProgressService
    ){}

    getAll(): Promise<Redirect301Route[]>{
        return new Promise((resolve, reject) =>{
            let url: string = `${AppSettings.API_REDIRECT301}/redirect301`;
            this.client.get(url)
            .map(res => res.json())
            .subscribe(response => {
                let routes: Redirect301Route[] = [];
                routes = response.map(r => r = new Redirect301Route(r.redirectFrom, r.redirectTo));
                resolve(routes);
            }, error => {
                reject(error);
            })
        });
    }
}