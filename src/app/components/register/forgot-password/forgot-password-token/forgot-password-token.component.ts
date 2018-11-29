import { Component, OnInit, Renderer, ViewChild, ElementRef } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

import { CustomerManager } from "../../../../managers/customer.manager";
import { Router } from "@angular/router";

declare var swal: any;
declare var $: any;

@Component({
    templateUrl: '../../../../templates/register/forgot-password/forgot-password-token/forgot-password-token.component.html'
})
export class ForgotPasswordTokenComponent implements OnInit {
    forgotForm: FormGroup;
    email: string;
    confirmEmail: string;

    constructor(
        private formBuilder: FormBuilder,
        private customerManager: CustomerManager,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.forgotForm = this.formBuilder.group({
            email: ['',
                [
                    Validators.required,
                    Validators.email
                ]
            ],
            confirmEmail: ['',
                [
                    Validators.required,
                    Validators.email
                ]
            ]
        });
    }

    getForgotPasswordToken() {
        this.email = this.forgotForm.get('email').value;
        this.confirmEmail = this.forgotForm.get('confirmEmail').value;

        $('#btnEnviar').button('loading');
        this.customerManager.getTokenPassword(this.email)
            .subscribe(() => {
                $('#btnEnviar').button('reset');
                swal({
                    title: 'Solicitação Enviada!',
                    text: 'Um e-mail contendo informações para a recuperação de senha foi enviado para você',
                    type: 'success',
                    confirmButtonText: 'OK'
                });
                this.router.navigate(['']);
            }, error => {
                $('#btnEnviar').button('reset');
                swal({
                    title: 'Problemas para recuperar senha!',
                    text: error.error,
                    type: 'error',
                    confirmButtonText: 'OK'
                });
            });
    }

    validateEquals() {
        return !(this.forgotForm.get('email').value == this.forgotForm.get('confirmEmail').value);
    }

    invalidForgotForm(){
        return this.forgotForm.invalid || this.validateEquals();
    }
}
