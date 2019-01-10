import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { HttpClientHelper } from "../helpers/http.helper";
import { environment } from "../../environments/environment";
import { Payment } from "../models/payment/payment";
import { CreditCard } from "../models/payment/credit-card";
import { InstallmentsSimulation } from "../models/payment/installments-simulation";
import { PagseguroCreditCard } from "../models/pagseguro/pagseguro-card";
import { MercadoPagoCreditCard } from "../models/mercadopago/mercadopago-creditcard";
import { MercadoPagoPaymentMethod } from "../models/mercadopago/mercadopago-paymentmethod";
import { MercadoPagoInstallmentResponse } from "../models/mercadopago/mercadopago-installment-response";
import { PagSeguroSimulationResponse } from "../models/pagseguro/pagseguro-simulation";

@Injectable({
    providedIn: 'root'
})
export class PaymentService {
    client: HttpClientHelper;

    constructor(http: HttpClient) {
        this.client = new HttpClientHelper(http);
    }

    getAll(): Observable<Payment[]> {
        let url = `${environment.API_PAYMENTS}/payments`;
        return this.client.get(url);
    }

    getDefault(): Observable<Payment> {
        let url = `${environment.API_PAYMENTS}/payments/default`;
        return this.client.get(url);
    }

    bankSlipTransaction(cartId: string): Observable<string> {
        let url = `${environment.API_PAYMENTS}/payments/BankSlipTransaction/${cartId}`;
        return this.client.postText(url)
            .pipe(map(res => res.body));
    }

    creditCardTransaction(cartId, creditcard: CreditCard): Observable<string> {
        let url = `${environment.API_PAYMENTS}/payments/CreditCardTransaction/${cartId}`;
        return this.client.postText(url, creditcard)
            .pipe(map(res => res.body));
    }

    simulateInstallments(cartId: string): Observable<Payment[]> {
        let url = `${environment.API_PAYMENTS}/payments/PaymentSimulation/Cart/${cartId}`;
        return this.client.get(url);
    }

    simulateInstallmentsBySkuId(skuId: string): Observable<Payment[]> {
        let url = `${environment.API_INSTALLMENTS}/installments/payments/sku/${skuId}`;
        return this.client.get(url);
    }

    getInstallmentsSimulationSimpleBySkuId(skuId: string): Observable<InstallmentsSimulation> {
        let url = `${environment.API_INSTALLMENTS}/installments/simulation/sku/${skuId}`;
        return this.client.get(url);
    }

    simulateInstallmentsBySkuIdDefault(skuId: string, sessionId: string = null): Observable<Payment> {
        let url = `${environment.API_PAYMENTS}/payments/PaymentSimulation/Product/${skuId}/Default?sessionId=${sessionId}`;
        return this.client.get(url);
    }

    createPagSeguroSession(): Observable<string> {
        let url = `${environment.API_PAYMENTS}/payments/PagSeguro/Session`;
        return this.client.getText(url);
    }

    createPagSeguroSessionSimulator(): Observable<string> {
        let url = `${environment.API_PAYMENTS}/payments/PagSeguro/Session/Simulator`;
        return this.client.getText(url);
    }

    getPagSeguroInstallments(sessionId: string, amount: number, creditCardBrand: string, maxInstallmentNoInterest: number, isSandBox: boolean): Observable<PagSeguroSimulationResponse> {
        let urlProduction = `https://pagseguro.uol.com.br/checkout/v2/installments.json?sessionId=${sessionId}&amount=${amount}&creditCardBrand=${creditCardBrand}&maxInstallmentNoInterest=${maxInstallmentNoInterest}`;
        let urlSandbox = `https://sandbox.pagseguro.uol.com.br/checkout/v2/installments.json?sessionId=${sessionId}&amount=${amount}&creditCardBrand=${creditCardBrand}&maxInstallmentNoInterest=${maxInstallmentNoInterest}`;
        return this.client.get(isSandBox ? urlSandbox : urlProduction);
    }

    PagseguroBankSlip(cartId: string, hash: string): Observable<string> {
        let url = `${environment.API_PAYMENTS}/payments/PagSeguro/BankSlip/${cartId}?SenderHash=${hash}`;
        return this.client.postText(url, null)
            .pipe(map(res => res.body));
    }

    PagseguroCreditCard(cartId: string, hash: string, creditCard: PagseguroCreditCard): Observable<string> {
        let url = `${environment.API_PAYMENTS}/payments/PagSeguro/CreditCard/${cartId}/?SenderHash=${hash}`;
        return this.client.postText(url, creditCard)
            .pipe(map(res => res.body));
    }

    pickUpStoreTransaction(cartId: string): Observable<string> {
        let url = `${environment.API_PAYMENTS}/payments/PickUpStore/${cartId}/`;
        return this.client.postText(url, null)
            .pipe(map(res => res.body));
    }

    delivertPayment(cartId: string, changeFor: number = null): Observable<string> {
        let url = `${environment.API_PAYMENTS}/payments/DeliveryPayment/${cartId}/`;
        changeFor = (changeFor) ? changeFor : 0;
        let body = { type: 'Money', changeFor: changeFor };
        return this.client.postText(url, body)
            .pipe(map(res => res.body));
    }

    GetMercadoPagoPublicKey(): Observable<string> {
        let url = `${environment.API_PAYMENTS}/payments/MercadoPago/PublicKey/`;
        return this.client.getText(url)
    }

    MercadoPagoCreditCard(cartId: string, creditCard: MercadoPagoCreditCard): Observable<string> {
        let url = `${environment.API_PAYMENTS}/payments/MercadoPago/CreditCard/${cartId}`;
        return this.client.postText(url, creditCard)
            .pipe(map(res => res.body));
    }

    MercadoPagoBankSlip(cartId: string): Observable<string> {
        let url = `${environment.API_PAYMENTS}/payments/MercadoPago/BankSlip/${cartId}`;
        return this.client.postText(url, null)
            .pipe(map(res => res.body));
    }

    MercadoPagoGetPaymentsMethods(): Observable<MercadoPagoPaymentMethod[]> {
        let url = `${environment.API_PAYMENTS}/payments/MercadoPago/PaymentMethods`;
        return this.client.get(url);
    }

    MercadoPagoGetInstalments(payment_method_id: string, cartId: string): Observable<MercadoPagoInstallmentResponse> {
        let url = `${environment.API_PAYMENTS}/payments/MercadoPago/Installments/v2/${payment_method_id}/${cartId}`;
        return this.client.get(url);
    }
}