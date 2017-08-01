import { Injectable } from "@angular/core";
import { PaymentService } from "app/services/payment.service";
import { Payment } from "app/models/payment/payment";
import { PaymentMethodTypeEnum } from "app/enums/payment-method-type.enum";

@Injectable()
export class PaymentManager{
    
    constructor(private service: PaymentService){}

    getAll(): Promise<Payment[]>{
        return this.service.getAll();
    }

    simulateInstallmentsBySkuId(skuId: string): Promise<Payment[]>{
        return this.service.simulateInstallmentsBySkuId(skuId)
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
            .find(m => m.paymentMethods.findIndex(method => method.type == PaymentMethodTypeEnum.BankSlip) > -1);
    }

    isMundipaggBankslip(paymentSelected: Payment, payments: Payment[]): boolean{
        let mundipagg = this.getMundipaggBankslip(payments);
        
        if(paymentSelected && mundipagg && paymentSelected.id == mundipagg.id && mundipagg.paymentMethods[0].id == paymentSelected.paymentMethods[0].id)
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

    /*
    ** Validações de pagamentos - FIM
    */
}