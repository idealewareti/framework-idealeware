import { NgModule } from "@angular/core";
import { SignUpComponent } from "./signup/signup.component";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NotAuthGuard } from "../../guards/not-auth.guard";
import { PhoneMaskModule } from "../../directives/phone-mask/phone-mask.module";
import { ZipCodeMaskModule } from "../../directives/zipcode-mask/zipcode-mask.module";

@NgModule({
    declarations: [
        SignUpComponent
    ],
    imports: [
        RouterModule.forChild([
            { path: '', component: SignUpComponent, canActivate: [NotAuthGuard] },
        ]),
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        PhoneMaskModule,
        ZipCodeMaskModule
    ]
})
export class SignUpModule { }