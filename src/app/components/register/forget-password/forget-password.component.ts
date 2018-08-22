import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { equalsValidator } from "../../../directives/equals/equals.directive";
import { validEmail } from "../../../directives/email-validator/email-validator.directive";
import { CustomerService } from "../../../services/customer.service";
import { Router } from "@angular/router";
import { isPlatformBrowser } from '@angular/common';
import { CustomerManager } from '../../../managers/customer.manager';

declare var swal: any;

@Component({
    selector: 'forget-password',
    templateUrl: '../../../templates/register/forget-password/forget-password.html',
    styleUrls: ['../../../templates/register/forget-password/forget-password.scss'],
})
export class ForgetPasswordComponent {

    public email: string;
    confirmEmail: string;
    cpf_cnpj: string;

    formRecoverPassword: FormGroup;

    constructor(
        private manager: CustomerManager,
        private parentRouter: Router,
        builder: FormBuilder,
        @Inject(PLATFORM_ID) private platformId: Object,
    ) {
        this.formRecoverPassword = builder.group({
            email: ['', Validators.compose([
                Validators.required,
                validEmail()
            ])],
            confirmEmail: ['', Validators.compose([
                Validators.required,
                validEmail(),
                equalsValidator(this.email)

            ])],
            cpf_cnpj: ['', Validators.required]
        });

    }

    recoverPassword(event) {
        if (isPlatformBrowser(this.platformId)) {
            event.preventDefault();

            if (this.formRecoverPassword.invalid) {
                for (let i in this.formRecoverPassword.controls) {
                    (<any>this.formRecoverPassword.controls[i])._touched = true;
                }

                swal({
                    title: 'Erro ao solicitar recuperação de senha',
                    text: 'Verifique se todos os campos foram preenchidos corretamente',
                    type: 'error',
                    confirmButtonText: 'OK'
                });
            }
            else {
                this.manager.recoverPassword(this.cpf_cnpj, this.email)
                    .subscribe(() => {
                        swal({
                            title: 'Solicitação Enviada!',
                            text: 'Um e-mail contendo informações para a recuperação de senha foi enviado para você',
                            type: 'success',
                            confirmButtonText: 'OK'
                        });
                        this.parentRouter.navigateByUrl('/');

                    }, err => {
                        swal({
                            title: 'Erro ao solicitar recuperação de senha',
                            text: err.error,
                            type: 'error',
                            confirmButtonText: 'OK'
                        });
                    })
            }
        }
    }

    /* Validators */
    fieldIsBlank(field: string): boolean {
        if (!this.formRecoverPassword.controls[field].untouched && this.formRecoverPassword.controls[field].errors)
            if (this.formRecoverPassword.controls[field].errors['required'])
                return true;

        return false;
    }

    invalidEmail(field: string): boolean {
        if (!this.formRecoverPassword.controls[field].untouched && this.formRecoverPassword.controls[field].errors)
            if (this.formRecoverPassword.controls[field].errors['invalidEmail'])
                return true;

        return false;
    }

    emailNotConfirmed(): boolean {
        if (!this.formRecoverPassword.controls['confirmEmail'].untouched && this.formRecoverPassword.controls['confirmEmail'].errors)
            if (this.formRecoverPassword.controls['confirmEmail'].errors['equalsTo'])
                return true;

        return false;
    }

    hasError(key: string): boolean {
        return (this.formRecoverPassword.controls[key].touched && this.formRecoverPassword.controls[key].invalid);
    }
}