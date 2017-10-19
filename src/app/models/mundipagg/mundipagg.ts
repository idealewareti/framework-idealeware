import { Payment } from "app/models/payment/payment";
import { PaymentMethod } from "app/models/payment/payment-method";

export class MundipaggPayment{
    bankslip: Payment;
    creditCard: Payment;
    methodSelected: PaymentMethod

    constructor(bankslip: Payment = null, creditCard: Payment = null, methodSelected: PaymentMethod = null){
        this.bankslip = bankslip;
        this.creditCard = creditCard;
        this.methodSelected = methodSelected;
    }
}