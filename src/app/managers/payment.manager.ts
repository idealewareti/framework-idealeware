import { Injectable, Inject, PLATFORM_ID } from "@angular/core";
import { PaymentService } from "../services/payment.service";
import { Sku } from "../models/product/sku";
import { Payment } from "../models/payment/payment";
import { MercadoPagoPaymentMethod } from "../models/mercadopago/mercadopago-paymentmethod";
import { MercadoPagoInstallmentResponse } from "../models/mercadopago/mercadopago-installment-response";
import { PaymentMethodTypeEnum } from "../enums/payment-method-type.enum";
import { EnumPaymentType } from "../enums/payment-type.enum";
import { PaymentMethod } from "../models/payment/payment-method";
import { PaymentSetting } from "../models/payment/payment-setting";
import { MercadoPagoError } from "../models/mercadopago/mercadopago-error";
import { PagSeguroSimulationResponse } from "../models/pagseguro/pagseguro-simulation";
import { isPlatformBrowser } from "@angular/common";
import { Token } from "../models/customer/token";

@Injectable()
export class PaymentManager {
    constructor(private service: PaymentService, @Inject(PLATFORM_ID) private platformId: Object) { }

    private getToken(): Token {
        let token = new Token();
        if (isPlatformBrowser(this.platformId)) {
            token.accessToken = localStorage.getItem('auth');
            token.createdDate = new Date(localStorage.getItem('auth_create'));
            token.expiresIn = Number(localStorage.getItem('auth_expires'));
            token.tokenType = 'Bearer';
        }
        return token;
    }

    getAll(): Promise<Payment[]> {
        return new Promise((resolve, reject) => {
            this.service.getAll()
                .subscribe(response => {
                    let payments = response.map(p => p = new Payment(p));
                    resolve(payments);
                }, error => reject(error));
        })
    }

    getDefault(): Promise<Payment> {
        return new Promise((resolve, reject) => {
            this.service.getDefault()
                .subscribe(response => {
                    let payment: Payment = new Payment(response);
                    resolve(payment);

                }, error => reject(error));
        });
    }

    simulateInstallmentsBySkuId(skuId: string): Promise<Payment[]> {
        return new Promise((resolve, reject) => {
            this.service.simulateInstallmentsBySkuId(skuId)
                .subscribe(response => {
                    let simulator = response.map(p => p = new Payment(p));
                    resolve(simulator);
                }, error => reject(error));
        });
    }

    simulateInstallmentsBySkuIdDefault(skuId: string): Promise<Payment> {
        return new Promise((resolve, reject) => {
            let sessionId = this.getPagSeguroSession();
            this.service.simulateInstallmentsBySkuIdDefault(skuId, sessionId)
                .subscribe(response => {
                    let simulator = new Payment(response);
                    resolve(simulator);
                }, error => reject(error));
        });
    }

    simulateInstallmentsByCartId(cartId: string): Promise<Payment[]> {
        if (isPlatformBrowser(this.platformId)) {
            let token = this.getToken();
            return new Promise((resolve, reject) => {
                this.service.simulateInstallments(cartId, token)
                    .subscribe(response => {
                        let payments = response.map(p => p = new Payment(p));
                        resolve(payments);
                    }, error => reject(error));
            });
        }
    }

    getMercadoPagoMethods(): Promise<MercadoPagoPaymentMethod[]> {
        return new Promise((resolve, reject) => {
            this.service.MercadoPagoGetPaymentsMethods()
                .subscribe(response => {
                    let payments = response.map(g => g = new MercadoPagoPaymentMethod(g));
                    resolve(payments);
                }, error => reject(error));

        })
    }

    getMercadoPagoPublicKey(): Promise<string> {
        if (isPlatformBrowser(this.platformId)) {
            let token = this.getToken();
            return this.service.GetMercadoPagoPublicKey(token);
        }
    }

    getMercadoPagoInstalments(methodId: string, totalPurchasePrice: number): Promise<MercadoPagoInstallmentResponse> {
        return new Promise((resolve, reject) => {
            this.service.MercadoPagoGetInstalments(methodId, totalPurchasePrice)
                .subscribe(response => {
                    resolve(new MercadoPagoInstallmentResponse(response));
                }, error => reject(error));
        });
    }

    /*
    ** Validações de pagamentos - INICIO
    */

    hasMercadoPago(payments: Payment[]): boolean {
        if (payments.findIndex(p => p.name.toLowerCase() == 'mercadopago') > -1)
            return true;
        else return false;
    }

    getMercadoPago(payments: Payment[]): Payment {
        return payments.find(p => p.name.toLowerCase() == 'mercadopago');
    }

    isMercadoPago(paymentSelected: Payment, payments: Payment[]): boolean {
        let mercadopago = this.getMercadoPago(payments);
        if (paymentSelected && mercadopago && paymentSelected.id == mercadopago.id)
            return true;
        else return false;
    }

    hasPagSeguro(payments: Payment[]): boolean {
        if (payments.findIndex(p => p.name.toLowerCase() == 'pagseguro') > -1)
            return true;
        else return false;
    }

    getPagSeguro(payments: Payment[]): Payment {
        return payments.find(p => p.name.toLowerCase() == 'pagseguro');
    }

    isPagSeguro(paymentSelected: Payment, payments: Payment[]): boolean {
        let pagseguro = this.getPagSeguro(payments);
        if (paymentSelected && pagseguro && paymentSelected.id == pagseguro.id)
            return true;
        else return false;
    }

    hasMundipagg(payments: Payment[]): boolean {
        if (payments.findIndex(p => p.name.toLowerCase() == 'mundipagg') > -1)
            return true;
        else
            return false;
    }

    getMundipagg(payments: Payment[]): Payment[] {
        return payments.filter(p => p.name.toLowerCase() == 'mundipagg');
    }

    hasMundipaggBankslip(payments: Payment[]): boolean {
        if (this.hasMundipagg(payments)) {
            let payment = this.getMundipagg(payments).find(p => p.paymentMethods.length == 1);

            if (payment && payment.paymentMethods[0].type == PaymentMethodTypeEnum.BankSlip)
                return true;
            else return false;
        }
        else return false;
    }

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

    createPagSeguroSession(): Promise<string> {
        if (isPlatformBrowser(this.platformId)) {
            let token = this.getToken();
            return this.service.createPagSeguroSession(token);
        }
    }

    createPagSeguroSessionSimulator(): Promise<string> {
        return this.service.createPagSeguroSessionSimulator();
    }

    getPagSeguroSession(): string {
        if (isPlatformBrowser(this.platformId)) {
            return localStorage.getItem('pagseguro_session');
        }
        else {
            return null;
        }
    }

    getPagSeguroStoredSession(): Promise<string> {
        return new Promise((resolve, reject) => {
            if (isPlatformBrowser(this.platformId)) {
                let session: string = this.getPagSeguroSession();
                if (session)
                    resolve(session);
                else {
                    let auth: string = localStorage.getItem('auth');
                    if (auth)
                        return this.createPagSeguroSession();
                    else
                        return this.createPagSeguroSessionSimulator();
                }
            }
            else {
                resolve(null);
            }
        })
    }

    /*
    ** Simulador de Parcelas - INÍCIO
    */
    getInstallments(sku: Sku): Promise<Payment> {
        return this.simulateInstallmentsBySkuIdDefault(sku.id);
    }

    simulateInstallments(sku: Sku, payment: Payment): Promise<Payment> {
        let cardBrand: string = 'visa';
        let noInterestInstallmentQuantity: number = Number.parseInt(payment.settings.find(s => s.name == ("NoInterestInstallmentQuantity")).value);
        let productPrice: number = (sku.promotionalPrice > 0) ? sku.promotionalPrice : sku.price;

        return new Promise((resolve, reject) => {
            this.simulateInstallmentsBySkuId(sku.id)
                .then(payments => {
                    if (this.isMundiPagg(payment)) {
                        let simulated: Payment = this.getMundipagg(payments)[0];
                        payment.paymentMethods = simulated.paymentMethods;
                        resolve(payment);
                    }
                    else if (this.isMercadoPago(payment, payments)) {
                        let simulated: Payment = this.getMercadoPago(payments);
                        payment.paymentMethods = simulated.paymentMethods;
                        resolve(payment)
                    }
                })
                .catch(error => reject(error));
            // }
        })
    }

    getPagSeguroInstallments(sessionId: string, amount: number, creditCardBrand: string, maxInstallmentNoInterest: number, isSandBox: boolean): Promise<PagSeguroSimulationResponse> {
        return new Promise((resolve, reject) => {
            this.service.getPagSeguroInstallments(sessionId, amount, creditCardBrand, maxInstallmentNoInterest, isSandBox)
                .subscribe(response => {
                    resolve(response);
                }, error => {
                    reject(error);
                });
        });
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
        else { //else if(gateway.name.toLowerCase() == 'pagseguro'){
            let index = method.installment.length - 1;
            maxInstallment = method.installment[index].number;
            let installmentValue = method.installment[index].installmentPrice.toFixed(2).replace('.', ',')
            return `${maxInstallment}x de R$ ${installmentValue}`;
        }

    }
    /*
    ** Simulador de Parcelas - FIM


    /*
    ** Erros Mercado Pago - INICIO
    */
    getMercadoPagoError(code: string): MercadoPagoError {
        let errors: MercadoPagoError[] = [];
        errors.push(new MercadoPagoError("310", "Erro ao validar o cliente, tente novamente. Caso o erro persista, recarregue seu navegador", 400),
            new MercadoPagoError("200", "Chave pública não pode ser vazia. Caso o erro persista, recarregue seu navegador", 400),
            new MercadoPagoError("302", "Chave pública inválida. Caso o erro persista, recarregue seu navegador", 400),
            new MercadoPagoError("219", "Identificação do cliente não pode ser vazia. Caso o erro persista, recarregue seu navegador", 400),
            new MercadoPagoError("315", "Erro ao validar a loja. Caso o erro persista, recarregue seu navegador", 400),
            new MercadoPagoError("222", "Erro ao validar a loja. Caso o erro persista, recarregue seu navegador", 400),
            new MercadoPagoError("318", "Número de cartão inválido", 400),
            new MercadoPagoError("304", "Número de cartão incompleto", 400),
            new MercadoPagoError("703", "Número de cartão incompleto", 400),
            new MercadoPagoError("319", "Número de cartão inválido", 400),
            new MercadoPagoError("701", "Número de cartão inválido", 400),
            new MercadoPagoError("321", "Código de segurança inválido", 400),
            new MercadoPagoError("700", "Código de segurança inválido", 400),
            new MercadoPagoError("307", "Código de segurança inválido", 400),
            new MercadoPagoError("704", "Código de segurança inválido", 400),
            new MercadoPagoError("305", "Nome do titular do cartão inválido", 400),
            new MercadoPagoError("210", "O nome do titular do cartão não pode ser em branco", 400),
            new MercadoPagoError("316", "Nome do titular do cartão inválido", 400),
            new MercadoPagoError("211", "O número do CPF não pode ser em branco", 400),
            new MercadoPagoError("322", "CPF inválido", 400),
            new MercadoPagoError("323", "CPF inválido", 400),
            new MercadoPagoError("213", "CPF inválido", 400),
            new MercadoPagoError("324", "CPF inválido", 400),
            new MercadoPagoError("325", "Mês de validade do cartão inválido", 400),
            new MercadoPagoError("326", "Ano de validade do cartão inválido", 400),
            new MercadoPagoError("702", "Ano de validade do cartão inválido", 400),
            new MercadoPagoError("301", "Data de validade do cartão inválida", 400),
            new MercadoPagoError("317", "Identificação do cartão inválida", 400),
            new MercadoPagoError("320", "Data de validade do cartão inválida", 400),
            new MercadoPagoError("E111", "Requisição inválida", 400),
            new MercadoPagoError("E114", "O nome do titular do cartão não pode ser em branco", 400),
            new MercadoPagoError("E115", "Chave Pública não pode ser inválida", 400),
            new MercadoPagoError("E202", "Número de cartão de crédito inválido", 400),
            new MercadoPagoError("E203", "Código de segurança inválido", 400),
            new MercadoPagoError("E213", "invalid parameter card_present", 400),
            new MercadoPagoError("E301", "Número de cartão incompleto", 400),
            new MercadoPagoError("E302", "Código de segurança inválido", 400),
            new MercadoPagoError("E305", "CPF Inválido", 400),
            new MercadoPagoError("E501", "Chave Pública não encontrada", 400),
            new MercadoPagoError("E601", "An error ocurred doing POST cardtoken", 500),
            new MercadoPagoError("E602", "An error ocurred doing POST cardtoken", 500),
            new MercadoPagoError("E603", "An error ocurred doing POST cardtoken", 500),
            new MercadoPagoError("E604", "An error ocurred doing POST cardtoken", 500),
            new MercadoPagoError("E701", "An error ocurred doing PUT cardtoken", 500),
            new MercadoPagoError("E801", "An error ocurred trying to GET public_key data", 500),
            new MercadoPagoError("E502", "not found cardtoken", 404),
            new MercadoPagoError("E503", "not found user", 404)
        );

        return errors.find(e => e.code == code);
    }
    /*
    ** Erros Mercado Pago - FIM
    */
}