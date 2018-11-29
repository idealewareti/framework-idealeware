import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { ForgotPasswordTokenComponent } from "./forgot-password-token/forgot-password-token.component";
import { ForgotPasswordFormComponent } from "./forgot-password-form/forgot-password-form.component";
import { ForgotTokenGuard } from "../../../guards/forgot-token.guard";

const routes: Routes = [
    {
        path: '',
        component: ForgotPasswordTokenComponent
    },
    {
        path: ':token',
        component: ForgotPasswordFormComponent,
        canActivate: [ForgotTokenGuard]
    }
]

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ]
})
export class ForgotPasswordRoutingModule { }