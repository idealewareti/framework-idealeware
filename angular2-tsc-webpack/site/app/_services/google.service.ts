import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {HttpClient} from '../httpclient'
import {Title} from '@angular/platform-browser';
import {AppSettings} from '../app.settings';
import { NgProgressService } from "ngx-progressbar";
import { Google } from "../_models/google/google";

@Injectable()
export class GoogleService{

    constructor(
        private client: HttpClient,
        private loader: NgProgressService
    ){ }

    public  getAll(): Promise<Google>{
        return new Promise((resolve, reject) => {
            let url = `${AppSettings.API_GOOGLE}/google`;
            this.client.get(url)
                .map(res => res.json())
                .subscribe(response => {
                    let google = new Google(response);
                    resolve(google);
                }, error => reject(error));
        });
    }

}