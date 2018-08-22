import { NewsLetterService } from "../services/newsletter.service";
import { Injectable } from "@angular/core";
import { NewsLetter } from "../models/newsletter/newsletter";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class NewsLetterManager {

    constructor(private service: NewsLetterService) { }

    public createNewsLetter(newsLetter: NewsLetter, popupId: string): Observable<NewsLetter> {
        return this.service.createNewsLetter(newsLetter, popupId);
    }

}