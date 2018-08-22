import { PaymentMethod } from "./payment-method";
import { PaymentSetting } from "./payment-setting";
import { EnumPaymentType } from "./payment-type.enum";

export class Payment {
    id: string;
    default: boolean;
    isSandBox: boolean;
    name: string;
    type: EnumPaymentType;
    url: string;
    paymentReferenceCode: string;
    paymentDate: Date;
    paymentMethods: PaymentMethod[];
    settings: PaymentSetting[];    
}