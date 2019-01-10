import { PaymentService } from "../services/payment.service";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Payment } from "../models/payment/payment";
import { PaymentMethodTypeEnum } from "../enums/payment-method-type.enum";
import { EnumPaymentType } from "../models/payment/payment-type.enum";
import { InstallmentsSimulation } from "../models/payment/installments-simulation";
import { MercadoPagoPaymentMethod } from "../models/mercadopago/mercadopago-paymentmethod";
import { MercadoPagoInstallmentResponse } from "../models/mercadopago/mercadopago-installment-response";
import { Sku } from "../models/product/sku";
import { PaymentMethod } from "../models/payment/payment-method";
import { PaymentSetting } from "../models/payment/payment-setting";
import { PagSeguroSimulationResponse } from "../models/pagseguro/pagseguro-simulation";
import { shareReplay, map } from "rxjs/operators";
import { CartManager } from "./cart.manager";
import { PagseguroCreditCard } from "../models/pagseguro/pagseguro-card";
import { CreditCard } from "../models/payment/credit-card";
import { MercadoPagoCreditCard } from "../models/mercadopago/mercadopago-creditcard";

const CACHE_SIZE = 1;

@Injectable({
    providedIn: 'root'
})
export class PaymentManager {

    private cache$ = new Map<String, Observable<any>>();

    constructor(
        private service: PaymentService,
        private cartManager: CartManager
    ) { }

    /**
     * Seleciona todos pagamentos
     */
    getAll(): Observable<Payment[]> {
        return this.service.getAll();
    }

    /**
     * Seleciona pagamento default
     */
    getDefault(): Observable<Payment> {
        return this.service.getDefault();
    }

    /**
     * Seleciona uma simulação de pagamento do sku
     * @param skuId 
     */
    simulateInstallmentsBySkuId(skuId: string): Observable<Payment[]> {
        if (!this.cache$[skuId]) {
            this.cache$[skuId] = this.service.simulateInstallmentsBySkuId(skuId).pipe(
                shareReplay(CACHE_SIZE)
            );
        }
        return this.cache$[skuId];
    }

    /**
     * Seleciona simulação simples de pagamento do sku
     * @param skuId 
     */
    getInstallmentsSimulationSimpleBySkuId(skuId: string): Observable<InstallmentsSimulation> {
        if (!this.cache$[`modal-${skuId}`]) {
            this.cache$[`modal-${skuId}`] = this.service.getInstallmentsSimulationSimpleBySkuId(skuId).pipe(
                shareReplay(CACHE_SIZE)
            );
        }
        return this.cache$[`modal-${skuId}`];
    }

    /**
     * Seleciona simulação de pagamento default do sku
     * @param skuId 
     */
    simulateInstallmentsBySkuIdDefault(skuId: string): Observable<Payment> {
        let sessionId = this.getPagSeguroSession();
        return this.service.simulateInstallmentsBySkuIdDefault(skuId, sessionId);
    }

    /**
     * Seleciona simulação de pagamento do carrinho
     * @param cartId 
     */
    simulateInstallmentsByCartId(cartId: string): Observable<Payment[]> {
        return this.service.simulateInstallments(cartId);
    }

    /**
     * Seleciona todos os metodos de pagamentos
     */
    getMercadoPagoMethods(): Observable<MercadoPagoPaymentMethod[]> {
        return this.service.MercadoPagoGetPaymentsMethods();
    }

    /**
     * Seleciona a chave publica do mercado pago
     */
    getMercadoPagoPublicKey(): Observable<string> {
        return this.service.GetMercadoPagoPublicKey();
    }

    /**
     * Seleciona formas de pagamentos do mercado pago
     * @param methodId 
     * @param totalPurchasePrice 
     */
    getMercadoPagoInstalments(methodId: string, cartId: string): Observable<MercadoPagoInstallmentResponse> {
        return this.service.MercadoPagoGetInstalments(methodId, cartId);
    }

    /*
    ** Validações de pagamentos - INICIO
    */
    hasMercadoPago(payments: Payment[]): boolean {
        if (payments.findIndex(p => p.name.toLowerCase() == 'mercadopago') > -1)
            return true;
        else return false;
    }

    /**
     * Filtra pagamentos do mercado pago
     * @param payments 
     */
    getMercadoPago(payments: Payment[]): Payment {
        return payments.find(p => p.name.toLowerCase() == 'mercadopago');
    }

    /**
     * Valida se o pagamento é para o mercado pago
     * @param paymentSelected 
     * @param payments 
     */
    isMercadoPago(paymentSelected: Payment, payments: Payment[]): boolean {
        let mercadopago = this.getMercadoPago(payments);
        if (paymentSelected && mercadopago && paymentSelected.id == mercadopago.id)
            return true;
        else return false;
    }

    /**
     * Valida se contem pagamento do pag seguro
     * @param payments 
     */
    hasPagSeguro(payments: Payment[]): boolean {
        if (payments.findIndex(p => p.name.toLowerCase() == 'pagseguro') > -1)
            return true;
        else return false;
    }

    /**
     * Filtra pagamentos do pag seguro
     * @param payments 
     */
    getPagSeguro(payments: Payment[]): Payment {
        return payments.find(p => p.name.toLowerCase() == 'pagseguro');
    }

    /**
     * Valida se o pagamento é pag seguro
     * @param paymentSelected 
     * @param payments 
     */
    isPagSeguro(paymentSelected: Payment, payments: Payment[]): boolean {
        let pagseguro = this.getPagSeguro(payments);
        if (paymentSelected && pagseguro && paymentSelected.id == pagseguro.id)
            return true;
        else return false;
    }

    /**
     * Valida se contem pagamentos da mundipagg
     * @param payments 
     */
    hasMundipagg(payments: Payment[]): boolean {
        if (payments.findIndex(p => p.name.toLowerCase() == 'mundipagg') > -1)
            return true;
        else
            return false;
    }

    /**
     * Filtra pagamentos do mundipagg
     * @param payments 
     */
    getMundipagg(payments: Payment[]): Payment[] {
        return payments.filter(p => p.name.toLowerCase() == 'mundipagg');
    }

    /**
     * Valida se contem pagamentos mundipagg
     * @param payments 
     */
    hasMundipaggBankslip(payments: Payment[]): boolean {
        if (this.hasMundipagg(payments)) {
            let payment = this.getMundipagg(payments).find(p => p.paymentMethods.length == 1);

            if (payment && payment.paymentMethods[0].type == PaymentMethodTypeEnum.BankSlip)
                return true;
            else return false;
        }
        else return false;
    }

    /**
     * 
     * @param payments 
     */
    getMundipaggBankslip(payments: Payment[]): Payment {
        return payments
            .filter(p => p.name.toLowerCase() == 'mundipagg')
            .find(m => m.paymentMethods.findIndex(method => method.name.toLowerCase() == 'boleto') > -1);
    }

    isMundipaggBankslip(paymentSelected: Payment, payments: Payment[]): boolean {
        let mundipagg = this.getMundipaggBankslip(payments);

        if (paymentSelected
            && mundipagg
            && paymentSelected.paymentMethods.length > 0
            && paymentSelected.paymentMethods[0].id == mundipagg.paymentMethods[0].id
        )
            return true;
        else return false;
    }

    hasMundipaggCreditCard(payments: Payment[]): boolean {
        if (this.hasMundipagg(payments)) {
            let mundipaggs = this.getMundipagg(payments);
            if (mundipaggs.findIndex(m => m.paymentMethods.findIndex(method => method.type == PaymentMethodTypeEnum.CreditCard) > -1) > -1)
                return true;
            else
                return false;
        }
        else return false;
    }

    getMundipaggCreditCard(payments: Payment[]): Payment {
        return payments
            .filter(p => p.name.toLowerCase() == 'mundipagg')
            .find(m => m.paymentMethods.findIndex(method => method.type == PaymentMethodTypeEnum.CreditCard) > -1);
    }

    isMundipaggCreditCard(paymentSelected: Payment, payments: Payment[]): boolean {
        let mundipagg = this.getMundipaggCreditCard(payments);

        if (paymentSelected && mundipagg && paymentSelected.id == mundipagg.id && !this.isMundipaggBankslip(paymentSelected, payments))
            return true;
        else return false;
    }

    isMundiPagg(paymentSelected: Payment): boolean {
        if (paymentSelected && paymentSelected.name && paymentSelected.name.toLowerCase() == 'mundipagg')
            return true;
        else return false;
    }

    getDeliveryPayment(payments: Payment[]): Payment {
        return payments.find(p => p.type == EnumPaymentType.Offline && p.name.toLowerCase() == 'pagamento na entrega');
    }

    hasDeliveryPayment(payments: Payment[]): boolean {
        return (this.getDeliveryPayment(payments) ? true : false);
    }

    isDeliveryPayment(payment: Payment, payments: Payment[]): boolean {
        if (this.hasDeliveryPayment(payments) && payment) {
            return (payment.id == this.getDeliveryPayment(payments).id) ? true : false;
        }
        else return false
    }

    getPickUpStorePayment(payments: Payment[]): Payment {
        return payments.find(p => p.name.toLowerCase() == 'pagamento na loja');
    }

    hasPickUpStorePayment(payments: Payment[]): boolean {
        let payment = this.getPickUpStorePayment(payments);
        if (payment)
            return true;
        else return false;
    }

    isPickUpStorePayment(payment: Payment, payments: Payment[]): boolean {
        let pickUpStore: Payment = this.getPickUpStorePayment(payments);
        if (pickUpStore && payment.id == pickUpStore.id)
            return true;
        else return false;
    }

    /*
    ** Validações de pagamentos - FIM
    */
    createPagSeguroSession(): Observable<string> {
        return this.service.createPagSeguroSession();
    }

    createPagSeguroSessionSimulator(): Observable<string> {
        return this.service.createPagSeguroSessionSimulator();
    }

    getPagSeguroSession(): string {
        return localStorage.getItem('pagseguro_session');
    }

    setPagSeguroSession(sessionId): void {
        localStorage.setItem('pagseguro_session', sessionId);
    }

    getPagSeguroStoredSession(): Promise<string> {
        return new Promise((resolve, reject) => {
            let session: string = this.getPagSeguroSession();
            if (session)
                resolve(session);
            else {
                let auth: string = null//localStorage.getItem('auth');
                if (auth)
                    return this.createPagSeguroSession();
                else
                    return this.createPagSeguroSessionSimulator();
            }
        })
    }

    /*
    ** Simulador de Parcelas - INÍCIO
    */
    getInstallments(sku: Sku): Observable<Payment> {
        return this.simulateInstallmentsBySkuIdDefault(sku.id);
    }

    simulateInstallments(sku: Sku, payment: Payment): Observable<Payment> {
        return this.simulateInstallmentsBySkuId(sku.id)[0];
    }

    getPagSeguroInstallments(sessionId: string, amount: number, creditCardBrand: string, maxInstallmentNoInterest: number, isSandBox: boolean): Observable<PagSeguroSimulationResponse> {
        return this.service.getPagSeguroInstallments(sessionId, amount, creditCardBrand, maxInstallmentNoInterest, isSandBox);
    }

    getInstallmentText(gateway: Payment, method: PaymentMethod): string {
        let maxInstallment: number = 0;
        let installmentLimit: PaymentSetting = gateway.settings.find(s => s.name.toLowerCase() == 'installmentlimit');

        if (!method)
            return null;

        if (installmentLimit)
            method.installment = method.installment.slice(0, Number.parseInt(installmentLimit.value));

        if (gateway.name.toLowerCase() == 'mundipagg') {
            maxInstallment = method.installment[method.installment.length - 1].number;
            return `${maxInstallment}x de R$ ${method.installment[method.installment.length - 1].installmentPrice.toFixed(2).toString().replace('.', ',')}`;
        }
        else if (gateway.name.toLowerCase() == 'mercadopago') {
            let installment = method.installment[method.installment.length - 1].description;
            installment = installment.replace(/[(].+[)]/g, '').replace(' parcelas', 'x');
            return installment;
        }
        else {
            let index = method.installment.length - 1;
            maxInstallment = method.installment[index].number;
            let installmentValue = method.installment[index].installmentPrice.toFixed(2).replace('.', ',')
            return `${maxInstallment}x de R$ ${installmentValue}`;
        }

    }

    PagseguroBankSlip(hash: string): Observable<string> {
        return this.service.PagseguroBankSlip(this.cartManager.getCartId(), hash);
    }

    pickUpStoreTransaction(): Observable<string> {
        return this.service.pickUpStoreTransaction(this.cartManager.getCartId());
    }

    delivertPayment(changeFor: number = null): Observable<string> {
        return this.service.delivertPayment(this.cartManager.getCartId(), changeFor);
    }

    PagseguroCreditCard(hash: string, creditCard: PagseguroCreditCard): Observable<string> {
        return this.service.PagseguroCreditCard(
            this.cartManager.getCartId(),
            hash,
            creditCard
        )
    }

    creditCardTransaction(creditcard: CreditCard): Observable<string> {
        return this.service.creditCardTransaction(this.cartManager.getCartId(), creditcard);
    }

    MercadoPagoBankSlip(): Observable<string> {
        return this.service.MercadoPagoBankSlip(this.cartManager.getCartId());
    }

    MercadoPagoCreditCard(creditCard: MercadoPagoCreditCard): Observable<string> {
        return this.service.MercadoPagoCreditCard(this.cartManager.getCartId(), creditCard);
    }

    bankSlipTransaction(): Observable<string> {
        return this.service.bankSlipTransaction(this.cartManager.getCartId());
    }

    isCardOK(creditCard: CreditCard): boolean {
        if (creditCard) {
            if (!creditCard.creditCardBrand)
                return false;
            else if (!creditCard.creditCardNumber)
                return false;
            else if (!creditCard.expMonth)
                return false;
            else if (!creditCard.expYear)
                return false;
            else if (!creditCard.holderName)
                return false;
            else if (!creditCard.installmentCount)
                return false;
            else if (!creditCard.installmentValue)
                return false;
            else if (!creditCard.securityCode)
                return false;
            else if (creditCard.payment == 'pagseguro' && !creditCard.taxId)
                return false;
            else if (creditCard.payment == 'pagseguro' && !creditCard.birthDate)
                return false;
            else
                return true;
        }
    }

    getValueDiscountBankslip(): Observable<number> {
        return this.getAll()
            .pipe(map(payments => this.getMundipaggBankslip(payments).paymentMethods
                .find(m => m.type === PaymentMethodTypeEnum.BankSlip).discount));
    }
}