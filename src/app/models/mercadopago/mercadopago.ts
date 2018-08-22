import { MercadoPagoPaymentMethod } from "./mercadopago-paymentmethod";
import { MercadoPagoInstallmentResponse } from "./mercadopago-installment-response";

export class MercadoPagoPayment{
    public_key: string;
    methods: MercadoPagoPaymentMethod[] = [];
    methodSelected: MercadoPagoPaymentMethod = new MercadoPagoPaymentMethod();
    installmentResponse: MercadoPagoInstallmentResponse = new MercadoPagoInstallmentResponse();
    creditCardType: MercadoPagoPaymentMethod = new MercadoPagoPaymentMethod({payment_type_id: 'credit_card'});
}