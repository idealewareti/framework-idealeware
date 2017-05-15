import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { HttpClient } from '../httpclient'
import { Title } from '@angular/platform-browser';
import { AppSettings } from '../app.settings';
import { NgProgressService } from "ngx-progressbar";
import { NewsLetter } from "../_models/newsLetter/news-letter";

@Injectable()
export class NewsLetterService {

    constructor(
        private client: HttpClient,
        private loader: NgProgressService
    ) { }

    public createNewsLetter(newsLetter: NewsLetter, popupId: string): Promise<NewsLetter> {
        return new Promise((resolve, reject) => {
           let url = null;
            if(popupId)
                url = `${AppSettings.API_POPUP}/popup?popupId=${popupId}`;
            else
                url = `${AppSettings.API_POPUP}/popup`;
            this.client.post(url, newsLetter)
                .map(res => res.json())
                .subscribe(response => {
                    let newsLetter = new NewsLetter(response);
                    resolve(newsLetter);
                }, error => reject(error));
        });
    }

}