import { Injectable } from '@angular/core';
import { HttpClient } from '../helpers/httpclient'
import { Title } from '@angular/platform-browser';
import { AppSettings } from 'app/app.settings';
import { Contact } from "app/models/contact/contact";

@Injectable()
export class ContactService{
    constructor(
        private client: HttpClient,
    ){ }

    sendContact(contact: Contact): Promise<Contact>{
        return new Promise((resolve, reject) => {
            let url = `${AppSettings.API_CONTACT}/contacts`;

            this.client.post(url, contact)
            .map(res => res.json)
            .subscribe(response => {
                resolve(new Contact(response));
            }, error => reject(error));
        });
    }
}