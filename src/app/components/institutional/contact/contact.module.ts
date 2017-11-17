import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ContactComponent }  from './contact.component';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { EmailValidatorModule } from '../../../directives/email-validator/email-validator.module';


@NgModule({
    declarations: [ ContactComponent ],
    imports: [ BrowserModule, FormsModule, ReactiveFormsModule, EmailValidatorModule ],
    providers: [],
    exports: [ ContactComponent ]
})
export class ContactModule {}