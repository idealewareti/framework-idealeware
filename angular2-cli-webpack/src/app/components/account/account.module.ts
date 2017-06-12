import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AccountComponent }  from './account.component';
import { AddressPanelListModule } from '../account-address-panel/address-panel-list.module'
import { CurrencyFormatPipe } from "app/pipes/currency-format.pipe";

@NgModule({ declarations: [ AccountComponent ],
    imports: [ BrowserModule, AddressPanelListModule, CurrencyFormatPipe ],
    bootstrap: [ AccountComponent ]
})
export class AccountModule {}