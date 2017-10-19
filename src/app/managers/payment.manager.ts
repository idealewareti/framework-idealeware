import { Injectable } from "@angular/core";
import { PaymentService } from "app/services/payment.service";
import { Payment } from "app/models/payment/payment";
import { PaymentMethodTypeEnum } from "app/enums/payment-method-type.enum";
import { Sku } from "app/models/product/sku";
import { PagseguroInstallment } from "app/models/pagseguro/pagseguro-installment";
import { PaymentMethod } from "app/models/payment/payment-method";
import { MercadoPagoError } from "app/models/mercadopago/mercadopago-error";
import { PaymentSetting } from "app/models/payment/payment-setting";
import { PagSeguroSimulationResponse } from "app/models/pagseguro/pagseguro-simulation";
import { EnumPaymentType } from "app/enums/payment-type.enum";
import { MercadoPagoPaymentMethod } from "app/models/mercadopago/mercadopago-paymentmethod";
import { MercadoPagoInstallmentResponse } from "app/models/mercadopago/mercadopago-installment-response";

declare var PagSeguroDirectPayment: any;

@Injectable()
export class PaymentManager{
    
    constructor(private service: PaymentService){}

    getAll(): Promise<Payment[]>{
        return this.service.getAll();
    }

    getDefault(): Promise<Payment>{
        return this.service.getDefault();
    }

    simulateInstallmentsBySkuId(skuId: string): Promise<Payment[]>{
        return this.service.simulateInstallmentsBySkuId(skuId)
    }

    simulateInstallmentsBySkuIdDefault(skuId: string): Promise<Payment>{
        let sessionId = this.getPagSeguroSession();
        return this.service.simulateInstallmentsBySkuIdDefault(skuId, sessionId);
    }

    simulateInstallmentsByCartId(cartId: string): Promise<Payment[]>{
        return this.service.simulateInstallments(cartId);
    }

    getMercadoPagoMethods(): Promise<MercadoPagoPaymentMethod[]>{
        return this.service.MercadoPagoGetPaymentsMethods();
    }

    getMercadoPagoPublicKey(): Promise<string>{
        return this.service.GetMercadoPagoPublicKey();
    }

    getMercadoPagoInstalments(methodId: string, totalPurchasePrice: number): Promise<MercadoPagoInstallmentResponse>{
        return this.service.MercadoPagoGetInstalments(methodId, totalPurchasePrice);
    }

    /*
    ** Validações de pagamentos - INICIO
    */

    hasMercadoPago(payments: Payment[]): boolean{
        if(payments.findIndex(p => p.name.toLowerCase() == 'mercadopago') > -1)
            return true;
        else return false;
    }

    getMercadoPago(payments: Payment[]): Payment{
        return payments.find(p => p.name.toLowerCase() == 'mercadopago');
    }

    isMercadoPago(paymentSelected: Payment, payments: Payment[]): boolean{
        let mercadopago = this.getMercadoPago(payments);
        if(paymentSelected && mercadopago && paymentSelected.id == mercadopago.id)
            return true;
        else return false;
    }

    hasPagSeguro(payments: Payment[]): boolean{
        if(payments.findIndex(p => p.name.toLowerCase() == 'pagseguro') > -1)
            return true;
        else return false;
    }

    getPagSeguro(payments: Payment[]): Payment{
        return payments.find(p => p.name.toLowerCase() == 'pagseguro');
    }

    isPagSeguro(paymentSelected: Payment, payments: Payment[]): boolean{
        let pagseguro = this.getPagSeguro(payments);
        if(paymentSelected && pagseguro && paymentSelected.id  == pagseguro.id)
            return true;
        else return false;
    }

    hasMundipagg(payments: Payment[]): boolean{
        if(payments.findIndex(p => p.name.toLowerCase() == 'mundipagg') > -1)
            return true;
        else
            return false;
    }

    getMundipagg(payments: Payment[]): Payment[]{
        return payments.filter(p => p.name.toLowerCase() == 'mundipagg');
    }

    hasMundipaggBankslip(payments: Payment[]): boolean{
        if(this.hasMundipagg(payments)){
            let payment = this.getMundipagg(payments).find(p => p.paymentMethods.length == 1);

            if(payment && payment.paymentMethods[0].type == PaymentMethodTypeEnum.BankSlip)
                return true;
            else return false;
        }
        else return false;
    }

    getMundipaggBankslip(payments: Payment[]): Payment{
        return payments
            .filter(p => p.name.toLowerCase() == 'mundipagg')
            .find(m => m.paymentMethods.findIndex(method => method.name.toLowerCase() == 'boleto') > -1);
    }

    isMundipaggBankslip(paymentSelected: Payment, payments: Payment[]): boolean{
        let mundipagg = this.getMundipaggBankslip(payments);
        
        if(paymentSelected
            && mundipagg 
            && paymentSelected.paymentMethods.length > 0
            && paymentSelected.paymentMethods[0].id == mundipagg.paymentMethods[0].id
        )
            return true;
        else return false;
    }

    hasMundipaggCreditCard(payments: Payment[]): boolean{
        if(this.hasMundipagg(payments)){
            let mundipaggs = this.getMundipagg(payments);
            if(mundipaggs.findIndex(m => m.paymentMethods.findIndex(method => method.type == PaymentMethodTypeEnum.CreditCard) > -1) > -1)
                return true;
            else
                return false;
        }
        else return false;
    }

    getMundipaggCreditCard(payments: Payment[]): Payment{
        return payments
            .filter(p => p.name.toLowerCase() == 'mundipagg')
            .find(m => m.paymentMethods.findIndex(method => method.type == PaymentMethodTypeEnum.CreditCard) > -1);
    }

    isMundipaggCreditCard(paymentSelected: Payment, payments: Payment[]): boolean{
        let mundipagg = this.getMundipaggCreditCard(payments);

        if(paymentSelected && mundipagg && paymentSelected.id == mundipagg.id && !this.isMundipaggBankslip(paymentSelected, payments))
            return true;
        else return false;
    }

    isMundiPagg(paymentSelected: Payment): boolean{
        if(paymentSelected && paymentSelected.name && paymentSelected.name.toLowerCase() == 'mundipagg')
            return true;
        else return false;
    }

    getDeliveryPayment(payments: Payment[]): Payment{
        return payments.find(p => p.type == EnumPaymentType.Offline && p.name.toLowerCase() == 'pagamento na entrega');
    }

    hasDeliveryPayment(payments: Payment[]): boolean{
        return (this.getDeliveryPayment(payments) ? true : false);
    }

    isDeliveryPayment(payment: Payment, payments: Payment[]): boolean{
        if(this.hasDeliveryPayment(payments) && payment){
            return (payment.id == this.getDeliveryPayment(payments).id) ? true : false;
        }
        else return false
    }

    getPickUpStorePayment(payments: Payment[]): Payment{
        return payments.find(p => p.name.toLowerCase() == 'pagamento na loja');
    }

    hasPickUpStorePayment(payments: Payment[]): boolean{
        let payment = this.getPickUpStorePayment(payments);
        if(payment)
            return true;
        else return false;
    }

    isPickUpStorePayment(payment: Payment, payments: Payment[]): boolean{
        let pickUpStore: Payment = this.getPickUpStorePayment(payments);
        if(pickUpStore && payment.id == pickUpStore.id)
            return true;
        else return false;
    }

    /*
    ** Validações de pagamentos - FIM
    */
    
    createPagSeguroSession(): Promise<string>{
        return this.service.createPagSeguroSession();
    }

    createPagSeguroSessionSimulator(): Promise<string>{
        return this.service.createPagSeguroSessionSimulator();
    }

    getPagSeguroSession(): string{
        return localStorage.getItem('pagseguro_session');
    }

    getPagSeguroStoredSession(): Promise<string>{
        return new Promise((resolve, reject) => {
            let session: string =  this.getPagSeguroSession();
            if(session)
                resolve(session);
            else{
                let auth: string = localStorage.getItem('auth');
                if(auth)
                    return this.createPagSeguroSession();
                else
                    return this.createPagSeguroSessionSimulator();
            }
        })
    }

    /*
    ** Simulador de Parcelas - INÍCIO
    */
    getInstallments(sku: Sku): Promise<Payment>{
        return this.simulateInstallmentsBySkuIdDefault(sku.id);
    }

    simulateInstallments(sku: Sku, payment: Payment): Promise<Payment>{
        let cardBrand: string = 'visa';
        let noInterestInstallmentQuantity: number = Number.parseInt(payment.settings.find(s => s.name == ("NoInterestInstallmentQuantity")).value);
        let productPrice: number  = (sku.promotionalPrice > 0) ? sku.promotionalPrice : sku.price;

        return new Promise((resolve, reject) => {
            // if(payment.name.toLowerCase() == 'pagseguro'){
            //     this.createPagSeguroSessionSimulator()
            //     .then(session => this.getPagSeguroInstallments(session, productPrice, cardBrand, noInterestInstallmentQuantity, true))
            //     .then(response => {
            //         let installments: PagseguroInstallment[] = response.installments[cardBrand];
            //         let method = new PaymentMethod();
            //         method.name = 'Visa'
            //         installments.forEach(i => {
            //             method.installment.push(i.convertToInstallment());
            //         });
                    
            //         payment.paymentMethods.push(method);
            //         resolve(payment);
            //     })
            //     .catch(error => {
            //         console.log(error);
            //         reject('Não foi possível obter o parcelamento');
            //     });
            // }
            // else{
                this.simulateInstallmentsBySkuId(sku.id)
                .then(payments => {
                    if(this.isMundiPagg(payment)){
                        let simulated: Payment = this.getMundipagg(payments)[0];
                        payment.paymentMethods = simulated.paymentMethods;
                        resolve(payment);
                    }
                    else if(this.isMercadoPago(payment, payments)){
                        let simulated: Payment = this.getMercadoPago(payments);
                        payment.paymentMethods = simulated.paymentMethods;
                        resolve(payment)
                    }
                })
                .catch(error => reject(error));
            // }
        })
    }

    getPagSeguroInstallments(sessionId: string, amount: number, creditCardBrand: string, maxInstallmentNoInterest: number, isSandBox: boolean): Promise<PagSeguroSimulationResponse>{
        return this.service.getPagSeguroInstallments(sessionId, amount, creditCardBrand, maxInstallmentNoInterest, isSandBox);
        // return new Promise((resolve, reject) => {
        //     PagSeguroDirectPayment.setSessionId(sessionId);
        //     PagSeguroDirectPayment.getInstallments({
        //         amount: amount,
        //         creditCardBrand: creditCardBrand, 
        //         maxInstallmentNoInterest: maxInstallmentNoInterest, 
        //         success: response => resolve(new PagSeguroSimulationResponse(response)), 
        //         error: response => reject(response)
        //     });
        // });
    }

    getInstallmentText(gateway: Payment, method: PaymentMethod): string{
        let maxInstallment: number = 0;
        let installmentLimit: PaymentSetting = gateway.settings.find(s => s.name.toLowerCase() == 'installmentlimit');

        if(!method)
            return null;
            
        if(installmentLimit)
            method.installment = method.installment.slice(0, Number.parseInt(installmentLimit.value));

        if(gateway.name.toLowerCase() == 'mundipagg'){
            maxInstallment = method.installment[method.installment.length -1].number;
            return `${maxInstallment}x de R$ ${method.installment[method.installment.length -1].installmentPrice.toFixed(2).toString().replace('.', ',')}`;
        }
        else if(gateway.name.toLowerCase() == 'mercadopago'){
            let installment = method.installment[method.installment.length -1].description;
            installment = installment.replace(/[(].+[)]/g, '').replace(' parcelas', 'x');
            return installment;
        }
        else{ //else if(gateway.name.toLowerCase() == 'pagseguro'){
            let index = method.installment.length -1;
            maxInstallment = method.installment[index].number;
            let installmentValue = method.installment[index].installmentPrice.toString().replace('.', ',')
            return `${maxInstallment}x de R$ ${installmentValue}`;
        }
        
    }
    /*
    ** Simulador de Parcelas - FIM


    /*
    ** Erros Mercado Pago - INICIO
    */
    getMercadoPagoError(code: string): MercadoPagoError{
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