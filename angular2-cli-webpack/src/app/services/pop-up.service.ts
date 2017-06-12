import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { HttpClient } from '../helpers/httpclient'
import { Title } from '@angular/platform-browser';
import { AppSettings } from 'app/app.settings';
import { NgProgressService } from "ngx-progressbar";
import { PopUp } from "../models/popup/popup";

@Injectable()
export class PopUpService {

    constructor(
        private client: HttpClient
    ) { }

    public getPopUp(): Promise<PopUp> {
        return new Promise((resolve, reject) => {
            let url = `${AppSettings.API_POPUP}/popup`;
            this.client.get(url)
                .map(res => res.json())
                .subscribe(response => {
                    let popup = new PopUp(response);
                    resolve(popup)
                }, error => reject(error));
        });
    }
}