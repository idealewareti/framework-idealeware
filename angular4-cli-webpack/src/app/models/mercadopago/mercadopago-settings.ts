import { Bin } from "./mercadopago-bin";
import { MercadoPagoCardNumber } from "./mercadopago-card-number";
import { MercadoPagoSecurityCode } from "./mercadopago-security-code";

export class MercadoPagoSettings {
    bin: Bin;
    card_number: MercadoPagoCardNumber;
    security_code: MercadoPagoSecurityCode;

}