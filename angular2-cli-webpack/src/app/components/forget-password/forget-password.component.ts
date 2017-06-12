import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { AppSettings } from "app/app.settings";
import { Title } from "@angular/platform-browser";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { equalsValidator } from "app/directives/equals/equals.directive";
import { validEmail } from "app/directives/email-validator/email-validator.directive";
import { CustomerService } from "app/services/customer.service";
import { Router } from "@angular/router";

declare var swal: any;

@Component({
    moduleId: module.id,
    selector: 'forget-password',
    templateUrl: '../../views/forget-password.component.html',
})
export class ForgetPasswordComponent implements OnInit {
    
    public email: string;
    confirmEmail: string;
    cpf_cnpj: string;

    formRecoverPassword: FormGroup;

    constructor(
        private titleService: Title,
        private service: CustomerService,
        private parentRouter: Router,
        builder: FormBuilder
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

    ngOnInit() {
        AppSettings.setTitle('Recuperar Senha', this.titleService);
        window.scrollTo(0 ,0);
     }

     recoverPassword(event){
         event.preventDefault();

         if(this.formRecoverPassword.invalid){
             for(let i in this.formRecoverPassword.controls){
                (<any>this.formRecoverPassword.controls[i])._touched = true;
            }
             
             swal({
                    title: 'Erro ao solicitar recuperação de senha',
                    text: 'Verifique se todos os campos foram preenchidos corretamente',
                    type: 'error',
                    confirmButtonText: 'OK'
                });
         }
         else{
            this.service.recoverPassword(this.cpf_cnpj, this.email)
            .then(response => {
                swal({
                    title: 'Solicitação Enviada!',
                    text: 'Um e-mail contendo informações para a recuperação de senha foi enviado para você',
                    type: 'success',
                    confirmButtonText: 'OK'
                });
                this.parentRouter.navigateByUrl('/');

            })
            .catch(error => {
                swal({
                    title: 'Erro ao solicitar recuperação de senha',
                    text: error.text(),
                    type: 'error',
                    confirmButtonText: 'OK'
                });

                console.log(error);
            })
         }

     }

     /* Validators */
     fieldIsBlank(field: string): boolean{
         if(!this.formRecoverPassword.controls[field].untouched && this.formRecoverPassword.controls[field].errors)
            if(this.formRecoverPassword.controls[field].errors['required'])
                return true;
        
        return false;
     }

     invalidEmail(field: string): boolean{
         if(!this.formRecoverPassword.controls[field].untouched && this.formRecoverPassword.controls[field].errors)
            if(this.formRecoverPassword.controls[field].errors['invalidEmail'])
                return true;
        
        return false;
     }

     emailNotConfirmed(): boolean{
          if(!this.formRecoverPassword.controls['confirmEmail'].untouched && this.formRecoverPassword.controls['confirmEmail'].errors)
            if(this.formRecoverPassword.controls['confirmEmail'].errors['equalsTo'])
                return true;
        
        return false;
     }

     hasError(key: string): boolean{
        return (this.formRecoverPassword.controls[key].touched && this.formRecoverPassword.controls[key].invalid);
    }
}