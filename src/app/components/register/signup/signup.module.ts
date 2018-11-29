import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SignUpComponent } from "./signup.component";
import { NotAuthGuard } from "../../../guards/not-auth.guard";
import { ZipCodeMaskModule } from "../../../directives/zipcode-mask/zipcode-mask.module";
import { PhoneMaskModule } from "../../../directives/phone-mask/phone-mask.module";

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