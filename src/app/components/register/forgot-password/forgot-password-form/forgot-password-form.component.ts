import { Component, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { equalsValidator } from "../../../../directives/equals/equals.directive";
import { validEmail } from "../../../../directives/email-validator/email-validator.directive";
import { CustomerService } from "../../../../services/customer.service";
import { Router, ActivatedRoute } from "@angular/router";
import { isPlatformBrowser } from '@angular/common';
import { CustomerManager } from '../../../../managers/customer.manager';

declare var swal: any;
declare var $: any;

@Component({
    selector: 'forgot-password',
    templateUrl: '../../../../templates/register/forgot-password/forgot-password-form/forgot-password-form.html',
    styleUrls: ['../../../../templates/register/forgot-password/forgot-password-form/forgot-password-form.scss'],
})
export class ForgotPasswordFormComponent implements OnInit {

    forgotForm: FormGroup;
    password: string;
    passwordConfirm: string;

    constructor(
        private customerManager: CustomerManager,
        private router: Router,
        private formBuilder: FormBuilder,
        @Inject(PLATFORM_ID) private platformId: Object,
        private activatedRoute: ActivatedRoute
    ) { }

    ngOnInit(): void {
        this.forgotForm = this.formBuilder.group({
            password: ['', [
                Validators.required
            ]],
            passwordConfirm: ['', [
                Validators.required
            ]]
        })
    }

    recoverPassword() {
        this.password = this.forgotForm.get('password').value;
        this.passwordConfirm = this.forgotForm.get('passwordConfirm').value;

        $('#btnEnviar').button('loading');
        const token = this.activatedRoute.snapshot.params.token;
        this.customerManager.recoverPassword(this.password, token)
            .subscribe(customer => {
                $('#btnEnviar').button('reset');
                swal({
                    title: 'Senha recuperada com sucesso!',
                    text: 'Sua senha foi alterada com sucesso',
                    type: 'success',
                    confirmButtonText: 'OK'
                });
                this.router.navigate(['login']);
            }, err => {
                $('#btnEnviar').button('reset');
                swal({
                    title: 'Problemas para recuperar senha!',
                    text: err.error,
                    type: 'error',
                    confirmButtonText: 'OK'
                });
            });
    }

    validateEquals() {
        return !(this.forgotForm.get('password').value == this.forgotForm.get('passwordConfirm').value);
    }

    invalidForgotForm() {
        return this.forgotForm.invalid || this.validateEquals();
    }

    // recoverPassword(event) {
    //     if (isPlatformBrowser(this.platformId)) {
    //         event.preventDefault();

    //         if (this.formRecoverPassword.invalid) {
    //             for (let i in this.formRecoverPassword.controls) {
    //                 (<any>this.formRecoverPassword.controls[i])._touched = true;
    //             }

    //             swal({
    //                 title: 'Erro ao solicitar recuperação de senha',
    //                 text: 'Verifique se todos os campos foram preenchidos corretamente',
    //                 type: 'error',
    //                 confirmButtonText: 'OK'
    //             });
    //         }
    //         else {
    //             this.manager.recoverPassword(this.cpf_cnpj, this.email)
    //                 .subscribe(() => {
    //                     swal({
    //                         title: 'Solicitação Enviada!',
    //                         text: 'Um e-mail contendo informações para a recuperação de senha foi enviado para você',
    //                         type: 'success',
    //                         confirmButtonText: 'OK'
    //                     });
    //                     this.parentRouter.navigateByUrl('/');

    //                 }, err => {
    //                     swal({
    //                         title: 'Erro ao solicitar recuperação de senha',
    //                         text: err.error,
    //                         type: 'error',
    //                         confirmButtonText: 'OK'
    //                     });
    //                 })
    //         }
    //     }
    // }
}