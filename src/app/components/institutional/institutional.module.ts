import { InstitutionalComponent } from "./institutional/institutional.component";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { SafeHtmlModule } from "../../pipes/safe-html/safe-html.module";
import { ContactComponent } from "./contact/contact.component";
import { EmailValidatorModule } from "../../directives/email-validator/email-validator.module";
import { InstitutionalResolver } from "../../resolvers/institutional.resolver";

@NgModule({
    declarations: [
        InstitutionalComponent,
        ContactComponent
    ],
    imports: [
        RouterModule.forChild([
            { path: '', component: InstitutionalComponent, resolve: { institutional: InstitutionalResolver } },
        ]),
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        EmailValidatorModule,
        SafeHtmlModule
    ]
})
export class InstitutionalModule { }