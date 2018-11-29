import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LoginModule } from "./login/login.module";
import { SignUpModule } from "./signup/signup.module";
import { ForgotPasswordModule } from "./forgot-password/forgot-password.module";

@NgModule({
    imports: [
        CommonModule,
        LoginModule,
        ForgotPasswordModule,
        SignUpModule
    ]
})
export class RegisterModule { }