import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NewsLetterComponent } from './newsletter.component';
import { ReactiveFormsModule, FormsModule } from "@angular/forms";

@NgModule({
    declarations: [ NewsLetterComponent ],
    imports: [ BrowserModule, FormsModule, ReactiveFormsModule ],
    providers: [],
    exports: [ NewsLetterComponent ]
})
export class NewsLetterModule {}