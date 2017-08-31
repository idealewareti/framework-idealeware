import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {AppTexts} from 'app/app.texts';
import {Validations} from 'app/directives/validations';
import {Customer} from 'app/models/customer/customer';
import {CustomerService} from 'app/services/customer.service';
import { Title } from "@angular/platform-browser";
import { AppSettings } from "app/app.settings";

declare var swal: any;

@Component({
    moduleId: module.id,
    selector: 'user-edit',
    templateUrl: '../../../views/user-edit.component.html',
})
export class UserEditComponent implements OnInit {
    
    @Input() tabId: string;
    userEditForm: FormGroup;
    customer: Customer;
    birthdate: string;
    public readonly genders = AppTexts.GENDERS;
    
    constructor(
        private service: CustomerService,
        private parentRouter: Router,
        private route: ActivatedRoute,
        private builder: FormBuilder,
        private titleService: Title
    ) {
        this.customer = new Customer();
        this.userEditForm = builder.group({
            rg_Ie: [''],
            firstname_Companyname: ['', Validators.required],
            lastname_Tradingname: ['', Validators.required],
            email: [''],
            password: [''],
            phone: ['', Validators.required],
            celPhone: [''],
            receivenews: [''],
            gender: [''],
            birthdate: [''],
            receivePromotionalAndNews: ['']
        });
     }

    ngOnInit() { 
        AppSettings.setTitle('Alterar Meus Dados Cadastrais', this.titleService);
        
        this.service.getUser()
        .then(user => {
            this.customer = user;
            this.birthdate = this.dateToText(this.customer.birthdate);
        })
        .catch(error => {
            swal({
                title: 'Erro',
                text: 'Falha ao carregar o usuário',
                type: 'error'
            });
            console.log(error);
        });
    }

    dateToText(date){
        return new Date(date).toISOString().substring(0, 10);
    }

    textToDate(event){
        this.customer.birthdate = new Date(this.birthdate.split('-').map((item, index) => Number(item) - index % 2).toString());
    }

    validCPF() : boolean{
        return Validations.validCPF(this.customer.cpf_Cnpj);
    }
    validCNPJ() : boolean{
        return Validations.validCNPJ(this.customer.cpf_Cnpj);
    }

    strongPassword(): boolean{
        if(this.customer.password)
            return Validations.strongPassword(this.customer.password);
        else return true;
    }

    hasError(key: string): boolean{
        return (this.userEditForm.controls[key].touched && this.userEditForm.controls[key].invalid);
    }

    updateAccount(event){
        event.preventDefault();

        if(this.userEditForm.invalid){
            swal({
                title: 'Erro ao atualizar o cadastro',
                text: 'Os campos obrigatórios não foram preenchidos',
                type: 'warning'
            });
        }
        else{
            this.service.updateCustomer(this.customer)
            .then(customer => {
                swal({
                    title: 'Dados Cadastrais atualizados',
                    text: 'Seu cadastro foi atualizado',
                    type: 'success'
                })
                this.service.updateUserOnStorage(customer);
                this.parentRouter.navigateByUrl(`/conta/home`);
            })
            .catch(error => {
                swal({
                    title: 'Erro ao atualizar o cadastro',
                    text: error.text(),
                    type: 'error'
                })
            });
        }
    }
}