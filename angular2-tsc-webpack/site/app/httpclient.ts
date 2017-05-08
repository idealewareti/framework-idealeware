import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Token } from './_models/customer/token';
import { AppSettings } from './app.settings';

@Injectable()
export class HttpClient {

  http: Http;
  private domain: string;

  constructor(http: Http) {
    this.http = http;
    this.setUp()
      .map(res => res.json())
      .subscribe(response => this.domain = response.domain);
  }

  setUp() {
    return this.http.get('/config.json');
  }

  authorize(headers: Headers, token: Token) {
    headers.append('Authorization', `${token.tokenType} ${token.accessToken}`);
  }

  setStore(headers: Headers, params = []) {
    let zipcode = localStorage.getItem('customer_zipcode');
    headers.append('Domain', AppSettings.DOMAIN);
    headers.append('storeId', AppSettings.DOMAIN);
    headers.append('ZipCode', zipcode)
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


}