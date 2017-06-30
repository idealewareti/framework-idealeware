import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountHomeComponent } from "app/components/account/home/home-panel.component";
import { CurrencyFormatModule } from "app/pipes/currency-format/currency-format.module";
import { RouterModule } from "@angular/router";
import { AddressPanelListModule } from "app/components/account/address-list/address-panel-list.module";

@NgModule({
    declarations: [ AccountHomeComponent ],
    imports: [ CommonModule, CurrencyFormatModule, RouterModule, AddressPanelListModule ],
    exports: [ AccountHomeComponent ],
    providers: [],
})
export class AccountHomeModule {}