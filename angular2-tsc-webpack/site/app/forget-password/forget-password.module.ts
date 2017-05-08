import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from "@angular/forms";

@NgModule({
    declarations: [],
    imports: [ CommonModule ],
    exports: [ ForgetPasswordModule, FormsModule, ReactiveFormsModule, ],
    providers: [],
    bootstrap: []
})
export class ForgetPasswordModule {}