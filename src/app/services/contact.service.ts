import { Injectable } from '@angular/core';
import { HttpClientHelper } from '../helpers/http.helper';
import { Contact } from '../models/contact/contact';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ContactService {
    client: HttpClientHelper;

    constructor(http: HttpClient) {
        this.client = new HttpClientHelper(http);
    }

    sendContact(contact: Contact): Observable<Contact> {
        let url = `${environment.API_CONTACT}/contacts`;
        return this.client.post(url, contact);
    }
}