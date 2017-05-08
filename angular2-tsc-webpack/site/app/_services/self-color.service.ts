import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { HttpClient } from '../httpclient'
import { AppSettings } from '../app.settings';
import { NgProgressService } from "ngx-progressbar";
import { Product } from "../_models/product/product";
import { SelfColor } from "../_models/selfColor/self-color";
import { SelfColorFamily } from "../_models/selfColor/self-color-family";

@Injectable()
export class SelfColorService{

    private urlSelfColor: string = AppSettings.SELF_COLOR_PALETA;

    constructor(
        private client: HttpClient,
        private loaderService: NgProgressService
    ){ }

    getColors(family: SelfColorFamily): Promise<SelfColor[]>{
        return new Promise((resolve, reject) => {
            let url = `${this.urlSelfColor}/xml_paleta_familia_${family.id}.xml`;
            this.client.get(url)
            .map(res => res.text())
            .subscribe(response => {
                let parser = new DOMParser();
                let xmlDoc = parser.parseFromString(response, 'text/xml');
                let paleta = xmlDoc.firstChild['children'];
                let colors: SelfColor[] = [];
                for(let i = 0; i < paleta.length -1; i ++){
                    let code = paleta[i].attributes['codigo'].textContent;
                    let name = paleta[i].attributes['nome'].textContent;
                    let hex = paleta[i].attributes['hex'].textContent;
                    colors.push(new SelfColor(code, name, hex));
                    
                }

                resolve(colors);
            }, error => reject(error));
        });
    }

}