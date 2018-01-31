import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { PopUpNewsLetterComponent } from './popup-newsletter.component';
import { ReactiveFormsModule, FormsModule } from "@angular/forms";

@NgModule({
    declarations: [ PopUpNewsLetterComponent ],
    imports: [ BrowserModule, FormsModule, ReactiveFormsModule ],
    providers: [],
    exports: [ PopUpNewsLetterComponent ]
})
export class PopUpNewsLetterModule {}