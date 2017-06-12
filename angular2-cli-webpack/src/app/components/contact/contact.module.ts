import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ContactComponent }  from './contact.component';

@NgModule({
    declarations: [ ContactComponent ],
    imports: [ BrowserModule ],
    providers: [],
    exports: [ ContactComponent ]
})
export class ContactModule {}