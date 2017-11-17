import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { HttpClientHelper } from '../helpers/http.helper';
import { Http } from '@angular/http';
import { Observable } from "rxjs/Observable";
import { environment } from '../../environments/environment';
import { CustomPaintManufacturer } from '../models/custom-paint/custom-paint-manufacturer';
import { CustomPaintColor } from '../models/custom-paint/custom-paint-color';
import { CustomPaintVariation } from '../models/custom-paint/custom-paint-variation';
import { CustomPaintCombination } from '../models/custom-paint/custom-paint-combination';


@Injectable()
export class CustomPaintService {
    client: HttpClientHelper;

    constructor(http: Http) {
        this.client = new HttpClientHelper(http);
    }

    getManufacturers(): Observable<CustomPaintManufacturer[]> {
        let url = `${environment.API_CUSTOMPAINT}/CustomPaint/Manufacturers`;
        return this.client.get(url)
            .map(res => res.json())
    }

    getColorsFromManufacturer(manufacturer: string): Observable<CustomPaintColor[]> {
        let url = `${environment.API_CUSTOMPAINT}/CustomPaint/Colors/${manufacturer}`;
        return this.client.get(url)
            .map(res => res.json())
    }

    getVariations(manufacturer: string): Observable<CustomPaintVariation> {
        let url = `${environment.API_CUSTOMPAINT}/CustomPaint/Variations/${manufacturer}`;
        return this.client.get(url)
            .map(res => res.json())
    }

    getPaints(manufacturer: string, colorCode: string, optionId: string): Observable<CustomPaintCombination[]> {
        let url = `${environment.API_CUSTOMPAINT}/CustomPaint/Paints/${manufacturer}/${colorCode}/${optionId}`;
        return this.client.get(url)
            .map(res => res.json())
    }
}