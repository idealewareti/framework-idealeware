import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {AppTexts} from 'app/app.texts';
import {Validations} from 'app/directives/validations';
import {Customer} from 'app/models/customer/customer';
import {CustomerService} from 'app/services/customer.service';

declare var swal: any;

@Component({
    moduleId: module.id,
    selector: 'user-edit',
    templateUrl: '../../views/user-edit.component.html',
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
    ) {
        this.customer = new Customer();
        this.userEditForm = builder.group({
            rg_Ie: [''],
            cpf_Cnpj: ['', Validators.required],
            firstname_Companyname: ['', Validators.required],
            lastname_Tradingname: ['', Validators.required],
            email: [''],
            password: [''],
            phone: ['', Validators.required],
            celPhone: ['', Validators.required],
            receivenews: [''],
            gender: [''],
            birthdate: [''],
            receivePromotionalAndNews: ['']
        });
     }

    ngOnInit() { 
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
        })
    }

    dateToText(date){
        return new Date(date).toISOString().substring(0, 10);
    }

    textToDate(event){
        this.customer.birthdate = new Date(this.birthdate.split('-').map((item, index) => Number(item) - index % 2).toString());
    }

    public validCPF() : boolean{
        return Validations.validCPF(this.customer.cpf_Cnpj);
    }
    public validCNPJ() : boolean{
        return Validations.validCNPJ(this.customer.cpf_Cnpj);
    }

    public updateAccount(event){
        event.preventDefault();
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
                    text: error._body,
                    type: 'error'
                })
            });
    }
    
}