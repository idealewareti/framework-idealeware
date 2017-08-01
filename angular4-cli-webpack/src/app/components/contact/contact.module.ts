import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ContactComponent }  from './contact.component';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";


@NgModule({
    declarations: [ ContactComponent ],
    imports: [ BrowserModule, FormsModule, ReactiveFormsModule ],
    providers: [],
    exports: [ ContactComponent ]
})
export class ContactModule {}