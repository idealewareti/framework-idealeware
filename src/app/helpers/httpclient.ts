import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { AppSettings } from "app/app.settings";
import { Token } from "app/models/customer/token";
import { Observable } from 'rxjs/Observable';

@Injectable()
export class HttpClient {

  private domain: string;
  headers: Headers;

  constructor(private http: Http) {
    this.headers = new Headers();
  }

  setUp() {}
  
  /**
  * Adiciona o Token ao cabeçalho da requisição
  * @param {Token} token 
  * @memberof HttpClient
  */
  authorize(token: Token) {
    this.headers.append('Authorization', `${token.tokenType} ${token.accessToken}`);
  }

  /**
  * Adiciona o cabeçalho à requisição
  * @param {any} [params=[]] 
  * @param {Token} [token=null] 
  * @memberof HttpClient
  */
  setHeaders(params = [], token: Token = null) {
    let domain: string = AppSettings.DOMAIN;
    let zipcode = localStorage.getItem('customer_zipcode');
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Access-Control-Allow-Origin', '*');
    this.headers.append('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
    this.headers.append('Access-Control-Allow-Headers', 'Origin, Content-Type, X-Auth-Token');
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
   * Executa uma requisição do tipo GET
   * @param {any} url 
   * @param {Token} [token=null] 
   * @param {any} [params=[]] 
   * @returns {Observable<any>} 
   * @memberof HttpClient
   */
  get(url, token: Token = null, params = []): Observable<any> {
    this.setHeaders(params);
    return this.http.get(url, { headers: this.headers  });
  }

  getFipe(url) {
      return this.http.get(url, {
        headers: this.headers
      });
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
    this.setHeaders([], null);
    return this.http.delete(url, {
      headers: this.headers
    });
  }

  private handleErrors(res){
      if(!res.ok) throw new Error(res.statusText);
      else return res;
  }

  xhrPost(url: string, toSend){
    let zipcode = localStorage.getItem('customer_zipcode');
    return fetch(url, {
      headers: {'Content-Type': 'application/json', 'Domain': AppSettings.DOMAIN},
      method: 'post',
      body: JSON.stringify(toSend)
    })
    .then(res => this.handleErrors(res));
  }
}