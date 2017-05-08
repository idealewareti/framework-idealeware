import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import{ FormsModule } from '@angular/forms';
import { AddressPanelComponent }  from './address-panel.component';
import { AddressPanelListModule } from './address-panel-list.module';
import { NewAddressModule } from './address-edit.module';

@NgModule({ 
    declarations: [ AddressPanelComponent ],
    imports: [ BrowserModule, RouterModule, FormsModule, NewAddressModule, AddressPanelListModule ],
    exports: [ AddressPanelComponent ]
})
export class AddressPanelModule {}