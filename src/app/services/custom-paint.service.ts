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
import { CustomPaintSearch } from '../models/custom-paint/custom-paint-search';
import { Pagination } from '../models/pagination';


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

    getPaints(manufacturer: string, colorCode: string, page: number = 1, pageSize: number = 9): Promise<CustomPaintSearch> {
        return new Promise((resolve, reject) => {
            let pagination: Pagination;
            let url = `${environment.API_CUSTOMPAINT}/CustomPaint/Paints/${manufacturer}/${colorCode}?page=${page}&pageSize=${pageSize}`;
            this.client.get(url)
                .map(res => {
                    pagination = new Pagination(JSON.parse(res.headers.get('x-pagination')));
                    return res.json();
                })
                .subscribe(combinations => {
                    let search: CustomPaintSearch = new CustomPaintSearch();
                    search.pagination = pagination;
                    search.combinations = combinations;
                    resolve(search);
                }, error => reject(error));
        });
    }

    getPaintsByOption(manufacturer: string, colorCode: string, optionId: string, page: number = 1, pageSize: number = 9): Promise<CustomPaintSearch> {
        return new Promise((resolve, reject) => {
            let pagination: Pagination;
            let url = `${environment.API_CUSTOMPAINT}/CustomPaint/Paints/${manufacturer}/${colorCode}/${optionId}?page=${page}&pageSize=${pageSize}`;
            this.client.get(url)
                .map(res => {
                    pagination = new Pagination(JSON.parse(res.headers.get('x-pagination')));
                    return res.json();
                })
                .subscribe(combinations => {
                    let search: CustomPaintSearch = new CustomPaintSearch();
                    search.pagination = pagination;
                    search.combinations = combinations;
                    resolve(search);
                }, error => reject(error));
        });
    }
}