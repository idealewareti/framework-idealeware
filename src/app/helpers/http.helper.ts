import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { AppConfig } from "../app.config";

@Injectable({
    providedIn: 'root'
})
export class HttpClientHelper {

    constructor(private http: HttpClient) { }

    /**
     * Adiciona o cabeçalho para cada requisição nas API's
     * @param {string} [zipcode=null]
     * @memberof HttpClientHelper
     */
    getHeaders(zipcode: string = null): HttpHeaders {
        let domain: string = AppConfig.DOMAIN;
        let headers = new HttpHeaders()
            .append('Content-Type', 'application/json')
            .append('Access-Control-Allow-Origin', '*')
            .append('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS')
            .append('Access-Control-Allow-Headers', 'Origin, Content-Type, X-Auth-Token, X-Pagination')
            .append('Access-Control-Expose-Headers', 'X-Pagination')
            .append('Cache-control', 'no-cache')
            .append('Cache-control', 'no-store')
            .append('Expires', '0')
            .append('Pragma', 'no-cache')
            .append('Domain', domain)
            .append('storeId', domain);


        if (zipcode) {
            headers = headers
                .append('ZipCode', zipcode);
        }

        return headers;
    }

    /**
     * Adiciona o parametros para cada requisição nas API's
     * @param {any} [params=[]] 
     * @returns 
     * @memberof HttpClientHelper
     */
    getParams(params = []): HttpParams {
        let httpParams = new HttpParams();
        params.forEach(param => {
            httpParams = httpParams.set(param['key'], param['value']);
        });
        return httpParams;
    }

    /**
     * Executa uma requisição do tipo GET
     * @param {any} url 
     * @param {any} [params=[]] 
     * @returns 
     * @memberof HttpClientHelper
     */
    get(url, params = []): Observable<any> {
        return this.http.get(url, { headers: this.getHeaders(), params: this.getParams(params), responseType: 'json' }, );
    }

     /**
     * Executa uma requisição do tipo GET
     * @param {any} url 
     * @param {any} [params=[]] 
     * @returns 
     * @memberof HttpClientHelper
     */
    getText(url, params = []): Observable<any> {
        return this.http.get(url, { headers: this.getHeaders(), params: this.getParams(params), responseType: 'text' }, );
    }

    /**
     * Executa uma requisição do tipo POST
     * @param {any} url 
     * @param {any} data 
     * @returns {Observable<any>} 
     * @memberof HttpClient
     */
    post(url, data = null): Observable<any> {
        return this.http.post(url, data, { headers: this.getHeaders(), observe: 'response', responseType: 'json' });
    }

    /**
     * Executa uma requisição do tipo POST
     * @param {any} url 
     * @param {any} data 
     * @returns {Observable<any>} 
     * @memberof HttpClient
     */
    postText(url, data = null): Observable<any> {
        return this.http.post(url, data, { headers: this.getHeaders(), observe: 'response', responseType: 'text' });
    }

    /**
     * Executa uma requisição do tipo PUT
    * @param {any} url 
    * @param {any} data 
    * @returns {Observable<any>} 
    * @memberof HttpClient
    */
    put(url, data = null): Observable<any> {
        return this.http.put(url, data, { headers: this.getHeaders(), responseType: 'json' });
    }

    /**
     * Executa uma requisição do tipo DELETE
     * @param {any} url 
     * @returns {Observable<any>} 
     * @memberof HttpClient
    */
    delete(url): Observable<any> {
        return this.http.delete(url, { headers: this.getHeaders(), responseType: 'json' });
    }
}