import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import{ FormsModule } from '@angular/forms';
import { AddressPanelComponent }  from './address-panel.component';
import { CommonModule } from "@angular/common";
import { AddressPanelListModule } from "app/components/account/address-list/address-panel-list.module";

@NgModule({
    declarations: [ AddressPanelComponent ],
    imports: [ CommonModule, RouterModule, FormsModule, AddressPanelListModule ],
    exports: [ AddressPanelComponent ]
})
export class AddressPanelModule {}