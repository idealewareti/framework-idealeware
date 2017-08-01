import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { HttpClient } from '../helpers/httpclient'
import { Title } from '@angular/platform-browser';
import { AppSettings } from 'app/app.settings';
import { NgProgressService } from 'ngx-progressbar';
import { CustomPaintManufacturer } from "app/models/custom-paint/custom-paint-manufacturer";
import { CustomPaintColor } from "app/models/custom-paint/custom-paint-color";
import { CustomPaintVariation } from "app/models/custom-paint/custom-paint-variation";
import { CustomPaintCombination } from "app/models/custom-paint/custom-paint-combination";

@Injectable()
export class CustomPaintService{

    constructor(private client: HttpClient, private loaderService: NgProgressService){}

    getManufacturers(): Promise<CustomPaintManufacturer[]>{
        return new Promise((resolve, reject) => {
            let url = `${AppSettings.API_CUSTOMPAINT}/CustomPaint/Manufacturers`;
             this.client.get(url)
            .map(res => res.json())
            .subscribe(response => {
                let manufacturers = response.map(x => new CustomPaintManufacturer(x));
                resolve(manufacturers);
            }, error => reject(error));
        });
    }

    getColorsFromManufacturer(manufacturer: string): Promise<CustomPaintColor[]>{
        return new Promise((resolve, reject) => {
            let url = `${AppSettings.API_CUSTOMPAINT}/CustomPaint/Colors/${manufacturer}`;
            this.client.get(url)
            .map(res => res.json())
            .subscribe(response => {
                let colors = response.map(c => new CustomPaintColor(c));
                resolve(colors);
            }, error => reject(error));
        });
    }

    getVariations(manufacturer: string): Promise<CustomPaintVariation>{
        return new Promise((resolve, reject) => {
            let url = `${AppSettings.API_CUSTOMPAINT}/CustomPaint/Variations/${manufacturer}`;
            this.client.get(url)
            .map(res => res.json())
            .subscribe(response => {
                let variation = new CustomPaintVariation(response);
                resolve(variation);
            }, error => reject(error));
        });
    }

    getPaints(manufacturer: string, colorCode: string, optionId: string): Promise<CustomPaintCombination[]>{
        return new Promise((resolve, reject) => {
            let url = `${AppSettings.API_CUSTOMPAINT}/CustomPaint/Paints/${manufacturer}/${colorCode}/${optionId}`;
            this.client.get(url)
            .map(res => res.json())
            .subscribe(response => {
                let paints = response.map(x => new CustomPaintCombination(x));
                resolve(paints);
            }, error => reject(error));
        });
    }
}