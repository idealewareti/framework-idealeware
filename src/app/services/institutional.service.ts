import { Injectable } from "@angular/core";
import { HttpClientHelper } from "../helpers/http.helper";
import { Institutional } from "../models/institutional/institutional";
import { environment } from "../../environments/environment";

@Injectable()
export class InstitutionalService{
    constructor(private client: HttpClientHelper){}

    getAll(): Promise<Institutional[]>{
        return new Promise((resolve, reject) => {
            let url = `${environment.API_INSTITUTIONAL}/institutionals`;
            this.client.get(url)
                .map(res => res.json())
                .subscribe(response => {
                    let institutionals = response.map(i => i = new Institutional(i));
                    resolve(institutionals);
                }, error => reject(error));
        });
    }

    getById(id: string): Promise<Institutional>{
        return new Promise((resolve, reject) => {
            let url = `${environment.API_INSTITUTIONAL}/institutionals/${id}`;
            this.client.get(url)
                .map(res => res.json())
                .subscribe(response => {
                    let institutional = new Institutional(response);
                    resolve(institutional);
                }, error => reject(error));
        });
    }

    getDefault(): Promise<Institutional>{
        return new Promise((resolve, reject) => {
            let url = `${environment.API_INSTITUTIONAL}/institutionals/Default`;
             this.client.get(url)
            .map(res => res.json())
            .subscribe(response => {
                let institutional = new Institutional(response);
                resolve(institutional);
            }, error => reject(error));
        });
    }
}