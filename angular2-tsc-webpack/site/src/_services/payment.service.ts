import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {HttpClient} from '../httpclient'
import {AppSettings} from '../app.settings';
import { NgProgressService } from "ngx-progressbar";
import { Payment } from "../_models/payment/payment";
import { Token } from "../_models/customer/token";
import { CreditCard } from "../_models//payment/credit-card";
import { PagseguroCreditCard } from "../_models/pagseguro/pagseguro-card";

@Injectable()
export class PaymentService{

    private token: Token;

    constructor(
        private client: HttpClient,
        private loaderService: NgProgressService
    ){ }

    private getToken(){
        this.token = new Token();
        this.token.accessToken = localStorage.getItem('auth');
        this.token.createdDate = new Date(localStorage.getItem('auth_create'));
        this.token.expiresIn = Number(localStorage.getItem('auth_expires'));
        this.token.tokenType = 'Bearer';
    }

    public getAll(): Promise<Payment[]>{
        return new Promise((resolve, reject) => {
            let url = `${AppSettings.API_PAYMENTS}/payments`;
            this.client.get(url)
            .map(res => res.json())
            .subscribe(response => {
                
                // if(response.length)
                //     resolve(new Payment(response[0]));
                // else
                //     resolve(new Payment(response));

                let payments = response.map(p => p = new Payment(p));
                resolve(payments);
                
            }, error => reject(error));
        });
    }

    public bankSlipTransaction(cartId: string): Promise<string>{
        return new Promise((resolve, reject) => {
            this.getToken();
            let url = `${AppSettings.API_PAYMENTS}/payments/BankSlipTransaction/${cartId}`;
            this.client.post(url, null, this.token)
            .map(res => {
                if(res.status == 200) resolve(res.text());
                return res.json();
            })
            .subscribe(response => {
                resolve(response);
            }, error => reject(error));
        });
    }

    public creditCardTransaction(cartId, creditcard: CreditCard): Promise<string>{
        return new Promise((resolve, reject) => {
            this.getToken();
            let url = `${AppSettings.API_PAYMENTS}/payments/CreditCardTransaction/${cartId}`;
            this.client.post(url, creditcard, this.token)
            .map(res => {
                if(res.status == 200) resolve(res.text());
                return res.json();
            })
            .subscribe(response => {
                resolve(response);
            }, error => reject(error));
        });
    }

    public simulateInstallments(cartId): Promise<Payment[]>{
        return new Promise((resolve, reject) => {
            let url = `${AppSettings.API_PAYMENTS}/payments/PaymentSimulation/Cart/${cartId}`;
            this.getToken();
            this.client.get(url, this.token)
            .map(res => res.json())
            .subscribe(response => {
                let payments = response.map(p => p = new Payment(p));
                resolve(payments);
            }, error => reject(error));
        })
    }

    public simulateInstallmentsBySkuId(skuId: string): Promise<Payment[]>{
        return new Promise((resolve, reject) => {
            let url = `${AppSettings.API_PAYMENTS}/payments/PaymentSimulation/Product/${skuId}`;
            this.client.get(url)
            .map(res => res.json())
            .subscribe(response => {
                let simulater = response.map(p => p = new Payment(p));
                resolve(simulater);
            }, error => reject(error));
        });
    }

    public createPagSeguroSession(): Promise<string>{
        return new Promise((resolve, reject) => {
            let url = `${AppSettings.API_PAYMENTS}/payments/PagSeguro/Session`;
            this.getToken();
            this.client.get(url, this.token)
            .map(res => {
                localStorage.setItem('pagseguro_session', res.text())
                resolve(res.text());
            })
            .subscribe(response => {
                
            }, error => reject(error));
        });
    }

    public PagseguroBankSlip(cartId: string, hash: string): Promise<string>{
        return new Promise((resolve, reject) => {
            let url = `${AppSettings.API_PAYMENTS}/payments/PagSeguro/BankSlip/${cartId}?SenderHash=${hash}`;
            this.getToken();
            this.client.post(url, null, this.token)
            .map(res => {
                
                if(res.status == 200)
                    resolve(res.text());

                return res.json();
            })
            .subscribe(response => {
                resolve(response);
            
            }, error => reject(error));
        });
    }

    public PagseguroCreditCard(cartId: string, hash: string, creditCard: PagseguroCreditCard): Promise<string>{
        return new Promise((resolve, reject) => {
            let url = `${AppSettings.API_PAYMENTS}/payments/PagSeguro/CreditCard/${cartId}/?SenderHash=${hash}`;
            this.getToken();
            this.client.post(url, creditCard, this.token)
            .map(res => {
                
                if(res.status == 200)
                    resolve(res.text());

                return res.json();
            })
            .subscribe(response => {
                resolve(response);
            
            }, error => reject(error));
        });
    }

    public pickUpStoreTransaction(cartId: string): Promise<string>{
        return new Promise((resolve, reject) => {
            let url = `${AppSettings.API_PAYMENTS}/payments/PickUpStore/${cartId}/`;
            this.getToken();
            this.client.post(url, null, this.token)
            .map(res => {
                if(res.status == 200)
                    resolve(res.text());
                
                return res.json();
            })
            .subscribe(response => {
                resolve(response);
            }, error => reject(error));
        });
    }

    public delivertPayment(cartId: string, changeFor: number = null): Promise<string>{
        return new Promise((resolve, reject) => {
            let url = `${AppSettings.API_PAYMENTS}/payments/DeliveryPayment/${cartId}/`;
            changeFor = (changeFor) ? changeFor : 0;
            let body = { type: 'Money', changeFor: changeFor };
            this.getToken();
            this.client.post(url, body, this.token)
            .map(res => {
                if(res.status == 200)
                    resolve(res.text());
                
                return res.json();
            })
            .subscribe(response => {
                resolve(response);
            }, error => reject(error));
        });
    }
}