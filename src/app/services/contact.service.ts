import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Http } from '@angular/http';
import { HttpClientHelper } from '../helpers/http.helper';
import { Contact } from '../models/contact/contact';
import { environment } from '../../environments/environment';
import { Observable } from "rxjs/Observable";

@Injectable()
export class ContactService {
    client: HttpClientHelper;

    constructor(http: Http) {
        this.client = new HttpClientHelper(http);
    }

    sendContact(contact: Contact): Observable<Contact> {
        let url = `${environment.API_CONTACT}/contacts`;
        return this.client.post(url, contact)
            .map(res => res.json)
    }
}