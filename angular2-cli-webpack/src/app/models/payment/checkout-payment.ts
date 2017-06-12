import { Payment } from "./payment";
import { PaymentMethod } from "./payment-method";
import { PagseguroOption } from "../pagseguro/pagseguro-option";

export class PaymentSelected {
    payment: Payment;
    method: PaymentMethod;
    pagseguro: PagseguroOption;

    constructor(payment: Payment = null, method: PaymentMethod = null, pagseguro: PagseguroOption = null){
        this.payment = payment;
        this.method = method;
        this.pagseguro = pagseguro;
    }
}