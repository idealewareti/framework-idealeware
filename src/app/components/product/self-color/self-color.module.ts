import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SelfColorComponent } from './self-color.component';

@NgModule({
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
    declarations: [SelfColorComponent],
    exports: [SelfColorComponent]
})
export class SelfColorModule {}
