import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { AppSettings } from "app/app.settings";
import { Token } from "app/models/customer/token";

@Injectable()
export class HttpClient {

  private domain: string;

  constructor(private http: Http) {}

  setUp() {}

  authorize(headers: Headers, token: Token) {
    headers.append('Authorization', `${token.tokenType} ${token.accessToken}`);
  }

  setStore(headers: Headers, params = []) {
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
    headers.append('Access-Control-Allow-Headers', 'Origin, Content-Type, X-Auth-Token');
    
    let zipcode = localStorage.getItem('customer_zipcode');
    headers.append('Domain', AppSettings.DOMAIN);
    headers.append('storeId', AppSettings.DOMAIN);
    headers.append('ZipCode', zipcode);

    params.forEach(param => {
      headers.append(param['key'], param['value']);
    })
  }

  get(url, token: Token = null, params = []) {
    let headers = new Headers();
    this.setStore(headers, params);
    if (token) this.authorize(headers, token);
    return this.http.get(url, {
      headers: headers
    });
  }

  getFipe(url) {
    let headers = new Headers();
    return this.http.get(url, {
      headers: headers
    });
  }

  post(url, data, token: Token = null) {
    let headers = new Headers();
    this.setStore(headers);
    if (token) this.authorize(headers, token);
    return this.http.post(url, data, {
      headers: headers
    });
  }

  put(url, data, token: Token = null) {
    let headers = new Headers();
    this.setStore(headers);
    if (token) this.authorize(headers, token);
    return this.http.put(url, data, {
      headers: headers
    });
  }

  delete(url, token: Token = null) {
    let headers = new Headers();
    this.setStore(headers);
    if (token) this.authorize(headers, token);
    return this.http.delete(url, {
      headers: headers
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