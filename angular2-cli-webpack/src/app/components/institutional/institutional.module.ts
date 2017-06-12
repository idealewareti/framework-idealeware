import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { InstitutionalComponent }  from './institutional.component';

@NgModule({
    declarations: [ InstitutionalComponent ],
    imports: [ BrowserModule ],
    providers: [],
    exports: [ InstitutionalComponent ]
})
export class InstitutionalModule {}