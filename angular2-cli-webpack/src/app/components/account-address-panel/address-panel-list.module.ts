import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AddressPanelListComponent }  from './address-panel-list.component';

@NgModule({ 
    declarations: [ AddressPanelListComponent ],
    imports: [ BrowserModule, RouterModule ],
    providers: [],
    exports: [ AddressPanelListComponent ]
})
export class AddressPanelListModule {}