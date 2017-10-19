import { Payment } from "./payment";
import { PaymentMethod } from "./payment-method";
import { PagseguroOption } from "../pagseguro/pagseguro-option";
import { MercadoPagoPaymentMethod } from "app/models/mercadopago/mercadopago-paymentmethod";

export class PaymentSelected {
    payment: Payment;
    method: PaymentMethod;
    pagseguro: PagseguroOption;
    mercadopago: MercadoPagoPaymentMethod; 
    changeFor: number;
    valid: boolean = true;

    constructor(
        payment: Payment = null, 
        method: PaymentMethod = null, 
        pagseguro: PagseguroOption = null,
        mercadopago: MercadoPagoPaymentMethod = null,
        changeFor: number = null
    ){
        this.payment = payment;
        this.method = method;
        this.pagseguro = pagseguro;
        this.mercadopago = mercadopago;
        this.changeFor = (changeFor || changeFor <= 0) ? 0 : changeFor;
    }
}