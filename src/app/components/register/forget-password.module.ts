import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ForgetPasswordComponent } from "./forget-password/forget-password.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";

@NgModule({
    declarations:[
        ForgetPasswordComponent
    ],
    imports:[
        RouterModule.forChild([
            {path: '', component: ForgetPasswordComponent}
        ]),
        CommonModule,
        FormsModule,
        ReactiveFormsModule
    ]

})
export class ForgetPasswordModule{}