import {Injectable} from '@angular/core';
import {HttpClient} from '../helpers/httpclient'
import {Title} from '@angular/platform-browser';
import {AppSettings} from 'app/app.settings';
import { Google } from "../models/google/google";

@Injectable()
export class GoogleService{

    constructor(private client: HttpClient){ }

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