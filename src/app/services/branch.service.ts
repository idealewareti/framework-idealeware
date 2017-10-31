import {Injectable} from '@angular/core';
import {HttpClient} from '../helpers/httpclient'
import {Title} from '@angular/platform-browser';
import {AppSettings} from 'app/app.settings';
import { Branch } from "../models/branch/branch";

@Injectable()
export class BranchService{

    constructor(private client: HttpClient){ }

    public getBranches(zipcode: string): Promise<Branch[]>{
        return new Promise((resolve, reject) => {
            let url = `${AppSettings.API_BRANCH}/branchs/zipcode/${zipcode}`;
            this.client.get(url)
            .map(res => res.json())
            .subscribe(response => {
                let branches = response.map(branch => branch = new Branch(branch));
                resolve(branches);
            }, error => reject(error));
        });
    }
}