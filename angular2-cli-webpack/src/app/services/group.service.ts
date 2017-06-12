import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {HttpClient} from '../helpers/httpclient'
import {Title} from '@angular/platform-browser';
import {AppSettings} from 'app/app.settings';
import {NgProgressModule} from 'ngx-progressbar';
import {Group} from '../models/group/group';

@Injectable()
export class GroupService{
    constructor(private client: HttpClient){}

    getAll(): Promise<Group[]>{
        return new Promise((resolve, reject) => {
            let url = `${AppSettings.API_GROUP}/groups`;
            this.client.get(url)
            .map(res => res.json())
            .subscribe(response => {
                let groups = response.map(g => g = new Group(g));
                resolve(groups);
            }, error => reject(error));
        });
    }

    getById(id): Promise<Group>{
        return new Promise((resolve, reject) => {
            let url = `${AppSettings.API_GROUP}/groups/${id}`;
            this.client.get(url)
            .map(res => res.json())
            .subscribe(response => {
                let group = new Group(response);
                resolve(group);
            }, error => reject(error));
        });
    }

    
}