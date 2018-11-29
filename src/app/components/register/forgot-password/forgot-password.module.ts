import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { ForgotPasswordFormComponent } from "./forgot-password-form/forgot-password-form.component";
import { ForgotPasswordTokenComponent } from "./forgot-password-token/forgot-password-token.component";
import { ForgotPasswordRoutingModule } from "./forgot-password.routing.module";
import { EqualsDirective } from "../../../directives/equals/equals.directive";
import { EqualsModule } from "../../../directives/equals/equals.module";
import { RouterModule } from "@angular/router";
import { ForgotTokenGuard } from "../../../guards/forgot-token.guard";

@NgModule({
    declarations: [
        ForgotPasswordFormComponent,
        ForgotPasswordTokenComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ForgotPasswordRoutingModule,
        EqualsModule,
        RouterModule
    ],
    providers:[
        ForgotTokenGuard
    ]
})
export class ForgotPasswordModule { }