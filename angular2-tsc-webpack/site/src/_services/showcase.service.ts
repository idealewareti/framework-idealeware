import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {HttpClient} from '../httpclient'
import {Title} from '@angular/platform-browser';
import {AppSettings} from '../app.settings';
import {ShowCase} from '../_models/showcase/showcase';
import {Product} from '../_models/product/product';

@Injectable()
export class ShowCaseService{

    constructor(
        private client: HttpClient,
        private titleService: Title
    ){}

    getShowCase() : Promise<ShowCase>{
   		return new Promise((resolve, reject) => {
            let url = `${AppSettings.API_SHOWCASE}/showcases`;
            let showcase = new ShowCase();
            this.client.get(url)
            .map(res => res.json())
            .subscribe(response => {
                let showcase = new ShowCase(response);
                resolve(showcase);
                
            }, error => {
                console.log(error);
                reject(error);
            });
        });
           
    }

}