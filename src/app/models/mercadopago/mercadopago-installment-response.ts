import { MercadoPagoIssuer } from './mercadopago-issuer';
import { MercadoPagoPayerCost } from './mercadopago-payer-cost';

export class MercadoPagoInstallmentResponse {
    payment_method_id: string;
    payment_type_id: string;
    issuer: MercadoPagoIssuer;
    payer_costs: MercadoPagoPayerCost[];
}