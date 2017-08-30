import { Payment } from "./payment";
import { PaymentMethod } from "./payment-method";
import { PagseguroOption } from "../pagseguro/pagseguro-option";
import { MercadoPagoPaymentMethod } from "app/models/mercadopago/mercadopago-paymentmethod";
import { CreditCard } from "app/models/payment/credit-card";

export class PaymentSelected {
    payment: Payment;
    method: PaymentMethod;
    pagseguro: PagseguroOption;
    mercadopago: MercadoPagoPaymentMethod; 
    creditCard: CreditCard;

    constructor(
        payment: Payment = null, 
        method: PaymentMethod = null, 
        pagseguro: PagseguroOption = null,
        mercadopago: MercadoPagoPaymentMethod = null,
        creditCard: CreditCard = null
    ){
        this.payment = payment;
        this.method = method;
        this.pagseguro = pagseguro;
        this.mercadopago = mercadopago;
        this.creditCard = creditCard;
    }
}