import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountHomeComponent } from "./home-panel.component";
import { CurrencyFormatModule } from "../../../pipes/currency-format/currency-format.module";
import { RouterModule } from "@angular/router";
import { AddressPanelListModule } from "../address-list/address-panel-list.module";

@NgModule({
    declarations: [ AccountHomeComponent ],
    imports: [ CommonModule, CurrencyFormatModule, RouterModule, AddressPanelListModule ],
    exports: [ AccountHomeComponent ]
})
export class AccountHomeModule {}