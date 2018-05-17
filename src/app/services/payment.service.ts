import { Injectable } from "@angular/core";
import { HttpClientHelper } from "../helpers/http.helper";
import { environment } from "../../environments/environment";
import { Payment } from "../models/payment/payment";
import { Token } from "../models/customer/token";
import { CreditCard } from "../models/payment/credit-card";
import { PagSeguroSimulationResponse } from "../models/pagseguro/pagseguro-simulation";
import { PagseguroCreditCard } from "../models/pagseguro/pagseguro-card";
import { MercadoPagoCreditCard } from "../models/mercadopago/mercadopago-creditcard";
import { MercadoPagoPaymentMethod } from "../models/mercadopago/mercadopago-paymentmethod";
import { MercadoPagoInstallmentResponse } from "../models/mercadopago/mercadopago-installment-response";
import { Http } from "@angular/http";
import { Observable } from "rxjs/Observable";

@Injectable()
export class PaymentService {
    client: HttpClientHelper;

    constructor(http: Http) {
        this.client = new HttpClientHelper(http);
    }

    getAll(): Observable<Payment[]> {
        let url = `${environment.API_PAYMENTS}/payments`;
        return this.client.get(url)
            .map(res => res.json())
    }

    /**
     * Retorna o Pagamento padrão da loja
     * 
     * @returns {Promise<Payment>} 
     * @memberof PaymentService
     */
    getDefault(): Observable<Payment> {
        let url = `${environment.API_PAYMENTS}/payments/default`;
        console.log("API: "+ url);
        return this.client.get(url)
            .map(res => res.json())
    }

    bankSlipTransaction(cartId: string, token: Token): Promise<string> {
        return new Promise((resolve, reject) => {
            let url = `${environment.API_PAYMENTS}/payments/BankSlipTransaction/${cartId}`;
            console.log("API: "+ url);
            this.client.post(url, null, token)
                .map(res => {
                    if (res.status == 200) resolve(res.text());
                    return res.json();
                })
                .subscribe(response => {
                    resolve(response);
                }, error => reject(error));
        });
    }

    creditCardTransaction(cartId, creditcard: CreditCard, token: Token): Promise<string> {
        return new Promise((resolve, reject) => {
            let url = `${environment.API_PAYMENTS}/payments/CreditCardTransaction/${cartId}`;
            console.log("API: "+ url);
            this.client.post(url, creditcard, token)
                .map(res => {
                    if (res.status == 200) resolve(res.text());
                    return res.json();
                })
                .subscribe(response => {
                    resolve(response);
                }, error => reject(error));
        });
    }

    simulateInstallments(cartId: string, token: Token): Observable<Payment[]> {
        let url = `${environment.API_PAYMENTS}/payments/PaymentSimulation/Cart/${cartId}`;
        console.log("API: "+ url);
        return this.client.get(url, token)
            .map(res => res.json())
    }

    simulateInstallmentsBySkuId(skuId: string): Observable<Payment[]> {
        let url = `${environment.API_PAYMENTS}/payments/PaymentSimulation/Product/${skuId}`;
        console.log("API: "+ url);
        return this.client.get(url)
            .map(res => res.json())
    }

    /**
     * Gera uma simulação do parcelamento
     * @param {string} skuId 
     * @param {string} [sessionId=null] Sessão do Pagseguro
     * @returns {Promise<Payment>} 
     * @memberof PaymentService
     */
    simulateInstallmentsBySkuIdDefault(skuId: string, sessionId: string = null): Observable<Payment> {
        let url = `${environment.API_PAYMENTS}/payments/PaymentSimulation/Product/${skuId}/Default?sessionId=${sessionId}`;
        console.log("API: "+ url);
        return this.client.get(url)
            .map(res => res.json())
    }

    createPagSeguroSession(token: Token): Promise<string> {
        return new Promise((resolve, reject) => {
            let url = `${environment.API_PAYMENTS}/payments/PagSeguro/Session`;
            console.log("API: "+ url);
            this.client.get(url, token)
                .map(res => {
                    resolve(res.text());
                })
                .subscribe(response => {

                }, error => reject(error));
        });
    }

    createPagSeguroSessionSimulator(): Promise<string> {
        return new Promise((resolve, reject) => {
            let url = `${environment.API_PAYMENTS}/payments/PagSeguro/Session/Simulator`;
            console.log("API: "+ url);
            this.client.get(url)
                .map(res => {
                    resolve(res.text());
                })
                .subscribe(response => {

                }, error => reject(error));
        });
    }

    getPagSeguroInstallments(sessionId: string, amount: number, creditCardBrand: string, maxInstallmentNoInterest: number, isSandBox: boolean): Observable<PagSeguroSimulationResponse> {
        let urlProduction = `https://pagseguro.uol.com.br/checkout/v2/installments.json?sessionId=${sessionId}&amount=${amount}&creditCardBrand=${creditCardBrand}&maxInstallmentNoInterest=${maxInstallmentNoInterest}`;
        let urlSandbox = `https://sandbox.pagseguro.uol.com.br/checkout/v2/installments.json?sessionId=${sessionId}&amount=${amount}&creditCardBrand=${creditCardBrand}&maxInstallmentNoInterest=${maxInstallmentNoInterest}`;
        console.log("API: "+ urlProduction);
        console.log("API: "+ urlSandbox);
        return this.client.get(isSandBox ? urlSandbox : urlProduction)
            .map(res => res.json())
    }

    PagseguroBankSlip(cartId: string, hash: string, token: Token): Promise<string> {
        return new Promise((resolve, reject) => {
            let url = `${environment.API_PAYMENTS}/payments/PagSeguro/BankSlip/${cartId}?SenderHash=${hash}`;
            console.log("API: "+ url);
            this.client.post(url, null, token)
                .map(res => {
                    if (res.status == 200) {
                        resolve(res.text());
                    }
                    return res.json();
                })
                .subscribe(response => {
                    resolve(response);
                }, error => reject(error));
        });
    }

    PagseguroCreditCard(cartId: string, hash: string, creditCard: PagseguroCreditCard, token: Token): Promise<string> {
        return new Promise((resolve, reject) => {
            let url = `${environment.API_PAYMENTS}/payments/PagSeguro/CreditCard/${cartId}/?SenderHash=${hash}`;
            console.log("API: "+ url);
            this.client.post(url, creditCard, token)
                .map(res => {
                    if (res.status == 200) {
                        resolve(res.text());
                    }
                    return res.json();
                })
                .subscribe(response => {
                    resolve(response);
                }, error => reject(error));
        });
    }

    pickUpStoreTransaction(cartId: string, token: Token): Promise<string> {
        return new Promise((resolve, reject) => {
            let url = `${environment.API_PAYMENTS}/payments/PickUpStore/${cartId}/`;
            console.log("API: "+ url);
            this.client.post(url, null, token)
                .map(res => {
                    if (res.status == 200) {
                        resolve(res.text());
                    }
                    return res.json();
                })
                .subscribe(response => {
                    resolve(response);
                }, error => reject(error));
        });
    }

    delivertPayment(cartId: string, token: Token, changeFor: number = null): Promise<string> {
        return new Promise((resolve, reject) => {
            let url = `${environment.API_PAYMENTS}/payments/DeliveryPayment/${cartId}/`;
            console.log("API: "+ url);
            changeFor = (changeFor) ? changeFor : 0;
            let body = { type: 'Money', changeFor: changeFor };
            this.client.post(url, body, token)
                .map(res => {
                    if (res.status == 200) {
                        resolve(res.text());
                    }
                    return res.json();
                })
                .subscribe(response => {
                    resolve(response);
                }, error => reject(error));
        });
    }

    GetMercadoPagoPublicKey(token: Token): Promise<string> {
        return new Promise((resolve, reject) => {
            let url = `${environment.API_PAYMENTS}/payments/MercadoPago/PublicKey/`;
            console.log("API: "+ url);
            this.client.get(url, token)
                .map(res => {
                    if (res.status == 200) {
                        resolve(res.text());
                    }
                    return res.json();
                })
                .subscribe(response => {
                    resolve(response);
                }, error => reject(error));
        });
    }

    MercadoPagoCreditCard(cartId: string, creditCard: MercadoPagoCreditCard, token: Token): Promise<string> {
        return new Promise((resolve, reject) => {
            let url = `${environment.API_PAYMENTS}/payments/MercadoPago/CreditCard/${cartId}`;
            console.log("API: "+ url);
            this.client.post(url, creditCard, token)
                .map(res => {
                    if (res.status == 200) {
                        resolve(res.text());
                    }
                    return res.json();
                })
                .subscribe(response => {
                    resolve(response);

                }, error => reject(error));
        });
    }

    MercadoPagoBankSlip(cartId: string, token: Token): Promise<string> {
        return new Promise((resolve, reject) => {
            let url = `${environment.API_PAYMENTS}/payments/MercadoPago/BankSlip/${cartId}`;
            console.log("API: "+ url);
            this.client.post(url, null, token)
                .map(res => {
                    if (res.status == 200) {
                        resolve(res.text());
                    }
                    return res.json();
                })
                .subscribe(response => {
                    resolve(response);

                }, error => reject(error));
        });
    }

    MercadoPagoGetPaymentsMethods(): Observable<MercadoPagoPaymentMethod[]> {
        let url = `${environment.API_PAYMENTS}/payments/MercadoPago/PaymentMethods`;
        console.log("API: "+ url);
        return this.client.get(url)
            .map(res => res.json())
    }

    MercadoPagoGetInstalments(payment_method_id: string, amount: number): Observable<MercadoPagoInstallmentResponse> {
        let url = `${environment.API_PAYMENTS}/payments/MercadoPago/Installments/${payment_method_id}/${amount}`;
        console.log("API: "+ url);
        return this.client.get(url)
            .map(res => res.json())
    }
}