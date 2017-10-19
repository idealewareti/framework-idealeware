import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { HttpClient } from '../helpers/httpclient'
import { AppSettings } from 'app/app.settings';
import { NgProgressService } from "ngx-progressbar";
import { Payment } from "../models/payment/payment";
import { Token } from "../models/customer/token";
import { CreditCard } from "../models//payment/credit-card";
import { PagseguroCreditCard } from "../models/pagseguro/pagseguro-card";
import { MercadoPagoPaymentMethod } from "app/models/mercadopago/mercadopago-paymentmethod";
import { MercadoPagoInstallmentResponse } from "app/models/mercadopago/mercadopago-installment-response";
import { MercadoPagoCreditCard } from "app/models/mercadopago/mercadopago-creditcard";
import { PagSeguroSimulationResponse } from "app/models/pagseguro/pagseguro-simulation";

@Injectable()
export class PaymentService {

    private token: Token;

    constructor(
        private client: HttpClient,
        private loaderService: NgProgressService
    ) { }

    private getToken() {
        this.token = new Token();
        this.token.accessToken = localStorage.getItem('auth');
        this.token.createdDate = new Date(localStorage.getItem('auth_create'));
        this.token.expiresIn = Number(localStorage.getItem('auth_expires'));
        this.token.tokenType = 'Bearer';
    }

    getAll(): Promise<Payment[]> {
        return new Promise((resolve, reject) => {
            let url = `${AppSettings.API_PAYMENTS}/payments`;
            this.client.get(url)
            .map(res => res.json())
            .subscribe(response => {
                let payments = response.map(p => p = new Payment(p));
                resolve(payments);

            }, error => reject(error));
        });
    }

    /**
     * Retorna o Pagamento padrão da loja
     * 
     * @returns {Promise<Payment>} 
     * @memberof PaymentService
     */
    getDefault(): Promise<Payment>{
        return new Promise((resolve, reject) => {
            let url = `${AppSettings.API_PAYMENTS}/payments/default`;
            this.client.get(url)
            .map(res => res.json())
            .subscribe(response => {
                let payment:Payment = new Payment(response);
                resolve(payment);

            }, error => reject(error));
        });
    }

    bankSlipTransaction(cartId: string): Promise<string> {
        return new Promise((resolve, reject) => {
            this.getToken();
            let url = `${AppSettings.API_PAYMENTS}/payments/BankSlipTransaction/${cartId}`;
            this.client.post(url, null, this.token)
                .map(res => {
                    if (res.status == 200) resolve(res.text());
                    return res.json();
                })
                .subscribe(response => {
                    resolve(response);
                }, error => reject(error));
        });
    }

    creditCardTransaction(cartId, creditcard: CreditCard): Promise<string> {
        return new Promise((resolve, reject) => {
            this.getToken();
            let url = `${AppSettings.API_PAYMENTS}/payments/CreditCardTransaction/${cartId}`;
            this.client.post(url, creditcard, this.token)
                .map(res => {
                    if (res.status == 200) resolve(res.text());
                    return res.json();
                })
                .subscribe(response => {
                    resolve(response);
                }, error => reject(error));
        });
    }

    simulateInstallments(cartId: string): Promise<Payment[]> {
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

    simulateInstallmentsBySkuId(skuId: string): Promise<Payment[]> {
        return new Promise((resolve, reject) => {
            let url = `${AppSettings.API_PAYMENTS}/payments/PaymentSimulation/Product/${skuId}`;
            this.client.get(url)
                .map(res => res.json())
                .subscribe(response => {
                    let simulator = response.map(p => p = new Payment(p));
                    resolve(simulator);
                }, error => reject(error));
        });
    }

    simulateInstallmentsBySkuIdDefault(skuId: string, sessionId: string = null): Promise<Payment>{
        return new Promise((resolve, reject) => {
            let url = `${AppSettings.API_PAYMENTS}/payments/PaymentSimulation/Product/${skuId}/Default?sessionId=${sessionId}`;
            this.client.get(url)
            .map(res => res.json())
            .subscribe(response => {
                let simulator = new Payment(response);
                resolve(simulator);
            }, error => reject(error));
        });
    }

    createPagSeguroSession(): Promise<string> {
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

    createPagSeguroSessionSimulator(): Promise<string> {
        return new Promise((resolve, reject) => {
            let url = `${AppSettings.API_PAYMENTS}/payments/PagSeguro/Session/Simulator`;
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

    getPagSeguroInstallments(sessionId: string, amount: number, creditCardBrand: string, maxInstallmentNoInterest: number, isSandBox: boolean): Promise<PagSeguroSimulationResponse>{
        return new Promise((resolve, reject) => {
            let urlProduction = `https://pagseguro.uol.com.br/checkout/v2/installments.json?sessionId=${sessionId}&amount=${amount}&creditCardBrand=${creditCardBrand}&maxInstallmentNoInterest=${maxInstallmentNoInterest}`;
            let urlSandbox = `https://sandbox.pagseguro.uol.com.br/checkout/v2/installments.json?sessionId=${sessionId}&amount=${amount}&creditCardBrand=${creditCardBrand}&maxInstallmentNoInterest=${maxInstallmentNoInterest}`;

            this.client.get(isSandBox ? urlSandbox : urlProduction)
            .map(res => res.json())
            .subscribe(response => {
                resolve(response);
            }, error => {
                reject(error);
            });
        })
    }

    PagseguroBankSlip(cartId: string, hash: string): Promise<string> {
        return new Promise((resolve, reject) => {
            let url = `${AppSettings.API_PAYMENTS}/payments/PagSeguro/BankSlip/${cartId}?SenderHash=${hash}`;
            this.getToken();
            this.client.post(url, null, this.token)
                .map(res => {

                    if (res.status == 200)
                        resolve(res.text());

                    return res.json();
                })
                .subscribe(response => {
                    resolve(response);

                }, error => reject(error));
        });
    }

    PagseguroCreditCard(cartId: string, hash: string, creditCard: PagseguroCreditCard): Promise<string> {
        return new Promise((resolve, reject) => {
            let url = `${AppSettings.API_PAYMENTS}/payments/PagSeguro/CreditCard/${cartId}/?SenderHash=${hash}`;
            this.getToken();
            this.client.post(url, creditCard, this.token)
                .map(res => {

                    if (res.status == 200)
                        resolve(res.text());

                    return res.json();
                })
                .subscribe(response => {
                    resolve(response);

                }, error => reject(error));
        });
    }

    pickUpStoreTransaction(cartId: string): Promise<string> {
        return new Promise((resolve, reject) => {
            let url = `${AppSettings.API_PAYMENTS}/payments/PickUpStore/${cartId}/`;
            this.getToken();
            this.client.post(url, null, this.token)
                .map(res => {
                    if (res.status == 200)
                        resolve(res.text());

                    return res.json();
                })
                .subscribe(response => {
                    resolve(response);
                }, error => reject(error));
        });
    }

    delivertPayment(cartId: string, changeFor: number = null): Promise<string> {
        return new Promise((resolve, reject) => {
            let url = `${AppSettings.API_PAYMENTS}/payments/DeliveryPayment/${cartId}/`;
            changeFor = (changeFor) ? changeFor : 0;
            let body = { type: 'Money', changeFor: changeFor };
            this.getToken();
            this.client.post(url, body, this.token)
                .map(res => {
                    if (res.status == 200)
                        resolve(res.text());

                    return res.json();
                })
                .subscribe(response => {
                    resolve(response);
                }, error => reject(error));
        });
    }

    GetMercadoPagoPublicKey(): Promise<string> {
        return new Promise((resolve, reject) => {
            let url = `${AppSettings.API_PAYMENTS}/payments/MercadoPago/PublicKey/`;
            this.getToken();
            this.client.get(url, this.token)
                .map(res => {
                    if (res.status == 200)
                        resolve(res.text());

                    return res.json();
                })
                .subscribe(response => {
                    resolve(response);
                }, error => reject(error));
        });
    }


    MercadoPagoCreditCard(cartId: string, creditCard: MercadoPagoCreditCard): Promise<string> {
        return new Promise((resolve, reject) => {
            let url = `${AppSettings.API_PAYMENTS}/payments/MercadoPago/CreditCard/${cartId}`;
            this.getToken();
            this.client.post(url, creditCard, this.token)
                .map(res => {

                    if (res.status == 200)
                        resolve(res.text());

                    return res.json();
                })
                .subscribe(response => {
                    resolve(response);

                }, error => reject(error));
        });
    }   


    MercadoPagoBankSlip(cartId: string): Promise<string> {
        return new Promise((resolve, reject) => {
            let url = `${AppSettings.API_PAYMENTS}/payments/MercadoPago/BankSlip/${cartId}`;
            this.getToken();
            this.client.post(url, null, this.token)
                .map(res => {

                    if (res.status == 200)
                        resolve(res.text());

                    return res.json();
                })
                .subscribe(response => {
                    resolve(response);

                }, error => reject(error));
        });
    }


    MercadoPagoGetPaymentsMethods(): Promise<MercadoPagoPaymentMethod[]> {
        return new Promise((resolve, reject) => {
            let url = `${AppSettings.API_PAYMENTS}/payments/MercadoPago/PaymentMethods`;
            this.client.get(url)
                .map(res => res.json())
                .subscribe(response => {
                    let payments = response.map(g => g = new MercadoPagoPaymentMethod(g));
                    resolve(payments);
                }, error => reject(error));
        });
    }


    MercadoPagoGetInstalments(payment_method_id:string, amount:number ): Promise<MercadoPagoInstallmentResponse> {
        return new Promise((resolve, reject) => {
            let url = `${AppSettings.API_PAYMENTS}/payments/MercadoPago/Installments/${payment_method_id}/${amount}`;
            this.client.get(url)
                .map(res => res.json())
                .subscribe(response => {
                    resolve(new MercadoPagoInstallmentResponse(response));
                }, error => reject(error));
        });
    }
}