import { Injectable } from '@angular/core';
import { NewsLetter } from "../models/newsletter/newsletter";
import { HttpClientHelper } from '../helpers/http.helper';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class NewsLetterService {
    client: HttpClientHelper;

    constructor(http: HttpClient) {
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
        return this.client.post(url, newsLetter);
    }

}