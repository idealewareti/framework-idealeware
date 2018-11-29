import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PaymentTicketComponent } from "./payment-ticket.component";
import { CurrencyFormatModule } from "../../../pipes/currency-format/currency-format.module";

@NgModule({
    declarations: [PaymentTicketComponent],
    imports: [CommonModule, CurrencyFormatModule],
    exports: [PaymentTicketComponent]
})
export class PaymentTicketModule { }