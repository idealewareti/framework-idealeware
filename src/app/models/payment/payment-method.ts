import { PaymentMethodTypeEnum } from "../../enums/payment-method-type.enum";
import { Installment } from "./installment";

export class PaymentMethod {
    id: string;
    code: string;
    type: PaymentMethodTypeEnum;
    name: string;
    icon: string;
    creditCardHolderName: string;
    creditCardInstallmentCount: number;
    creditCardInstallmentPrice: number;
    creditCardInterest: number;
    discount: number;
    bankSlipUrl: string;
    installment: Installment[];
}