import { MercadoPagoPaymentMethod } from "./mercadopago-paymentmethod";
import { MercadoPagoInstallmentResponse } from "./mercadopago-installment-response";

/**
 * Objeto com as informações de pagamento do Mercado Pago
 * 
 * @export
 * @class MercadoPagoPayment
 */
export class MercadoPagoPayment{
    public_key: string;
    methods: MercadoPagoPaymentMethod[] = [];
    methodSelected: MercadoPagoPaymentMethod = new MercadoPagoPaymentMethod();
    installmentResponse: MercadoPagoInstallmentResponse = new MercadoPagoInstallmentResponse();
    creditCardType: MercadoPagoPaymentMethod = new MercadoPagoPaymentMethod({payment_type_id: 'credit_card'});
}