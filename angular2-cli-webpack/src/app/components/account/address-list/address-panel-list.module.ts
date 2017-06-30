import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AddressPanelListComponent }  from './address-panel-list.component';
import { CommonModule } from "@angular/common";

@NgModule({
    declarations: [ AddressPanelListComponent ],
    imports: [ CommonModule, RouterModule ],
    providers: [],
    exports: [ AddressPanelListComponent ]
})
export class AddressPanelListModule {}