import { Injectable } from '@angular/core';
import { NewsLetter } from "../models/newsletter/newsletter";
import { HttpClientHelper } from '../helpers/http.helper';
import { Http } from '@angular/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class NewsLetterService {
    client: HttpClientHelper;

    constructor(http: Http) {
        this.client = new HttpClientHelper(http);
    }

    public createNewsLetter(newsLetter: NewsLetter, popupId: string): Observable<NewsLetter> {
        let url = null;
        if(popupId) {
            url = `${environment.API_POPUP}/popup?popupId=${popupId}`;
        }
        else {
            url = `${environment.API_POPUP}/popup`;
        }
        return this.client.post(url, newsLetter)
            .map(res => res.json());
    }

}