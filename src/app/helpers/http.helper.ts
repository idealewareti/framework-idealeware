import { Injectable } from "@angular/core";
import { Http, Headers } from "@angular/http";
import { AppConfig } from "../app.config";
import { Token } from "../models/customer/token";
import { Observable } from 'rxjs';

@Injectable()
export class HttpClientHelper {
    headers: Headers;

    constructor(private http: Http) {
        this.headers = new Headers();
    }

    /**
     * Adiciona o cabeçalho para cada requisição nas API's
     * @param {any} [params=[]] 
     * @param {Token} [token=null]
     * @memberof HttpClientHelper
     */
    setHeaders(params = [], token: Token = null, zipcode: string = null) {
        this.headers = new Headers();
        let domain: string = AppConfig.DOMAIN;
        this.headers.append('Content-Type', 'application/json');
        this.headers.append('Access-Control-Allow-Origin', '*');
        this.headers.append('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
        this.headers.append('Access-Control-Allow-Headers', 'Origin, Content-Type, X-Auth-Token, X-Pagination');
        this.headers.append('Access-Control-Expose-Headers', 'X-Pagination');
        this.headers.append('Cache-control', 'no-cache');
        this.headers.append('Cache-control', 'no-store');
        this.headers.append('Expires', '0');
        this.headers.append('Pragma', 'no-cache');
        this.headers.append('Domain', domain);
        this.headers.append('storeId', domain);
        this.headers.append('ZipCode', zipcode);

        params.forEach(param => {
            this.headers.append(param['key'], param['value']);
        });

        if (token) {
            this.authorize(token);
        }
    }

    /**
     * Adiciona o Token ao cabeçalho da requisição
     * @param {Token} token 
     * @memberof HttpClientHelper
     */
    authorize(token: Token) {
        this.headers.append('Authorization', `${token.tokenType} ${token.accessToken}`);
    }

    getHeaders(): Headers {
        return this.headers;
    }

    /**
     * Executa uma requisição do tipo GET
     * @param {any} url 
     * @param {Token} [token=null] 
     * @param {any} [params=[]] 
     * @returns 
     * @memberof HttpClientHelper
     */
    get(url, token: Token = null, params = []): Observable<any> {
        this.setHeaders(params, token);
        return this.http.get(url, { headers: this.headers });
    }

    /**
     * Executa uma requisição do tipo POST
     * @param {any} url 
     * @param {any} data 
     * @param {Token} [token=null] 
     * @returns {Observable<any>} 
     * @memberof HttpClient
     */
    post(url, data, token: Token = null): Observable<any> {
        this.setHeaders([], token);
        return this.http.post(url, data, {
            headers: this.headers
        });
    }

    /**
     * Executa uma requisição do tipo PUT
    * @param {any} url 
    * @param {any} data 
    * @param {Token} [token=null] 
    * @returns {Observable<any>} 
    * @memberof HttpClient
    */
    put(url, data, token: Token = null): Observable<any> {
        this.setHeaders([], token);
        return this.http.put(url, data, {
            headers: this.headers
        });
    }

    /**
     * Executa uma requisição do tipo DELETE
     * @param {any} url 
     * @param {Token} [token=null] 
     * @returns {Observable<any>} 
     * @memberof HttpClient
    */
    delete(url, token: Token = null): Observable<any> {
        this.setHeaders([], token);
        return this.http.delete(url, {
            headers: this.headers
        });
    }
}