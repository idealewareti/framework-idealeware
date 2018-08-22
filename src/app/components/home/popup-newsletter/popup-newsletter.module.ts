import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PopUpNewsLetterComponent } from './popup-newsletter.component';
import { ReactiveFormsModule, FormsModule } from "@angular/forms";

@NgModule({
    declarations: [ PopUpNewsLetterComponent ],
    imports: [ CommonModule, FormsModule, ReactiveFormsModule ],
    providers: [],
    exports: [ PopUpNewsLetterComponent ]
})
export class PopUpNewsLetterModule {}