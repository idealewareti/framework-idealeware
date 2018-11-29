import { Component, Input, OnChanges, SimpleChanges, OnInit } from "@angular/core";
import { PaymentManager } from "../../../managers/payment.manager";

@Component({
    selector: 'payment-ticket',
    templateUrl: '../../../templates/shared/payment-ticket/payment-ticket.component.html'
})
export class PaymentTicketComponent implements OnInit {
    @Input() price: number;
    @Input() promotionalPrice: number;
    valueBankslip: number;
    discount: number;

    constructor(private paymentManager: PaymentManager) { }

    ngOnInit(): void {
        this.paymentManager.getValueDiscountBankslip()
            .subscribe(discount => {
                this.discount = discount;
                let value = this.promotionalPrice > 0 ? this.promotionalPrice : this.price;
                this.valueBankslip = (value * ((100 - discount) / 100));
            });
    }

    haveDiscount() {
        return this.discount || false;
    }
}