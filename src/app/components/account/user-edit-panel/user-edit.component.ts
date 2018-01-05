import { Component, Input, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppTexts } from '../../../app.texts';
import { Validations } from '../../../directives/validations';
import { Customer } from '../../../models/customer/customer';
import { CustomerService } from '../../../services/customer.service';
import { Title } from "@angular/platform-browser";
import { isPlatformBrowser } from '@angular/common';
import { Token } from '../../../models/customer/token';
import { CustomerManager } from '../../../managers/customer.manager';
declare var swal: any;

@Component({
    moduleId: module.id,
    selector: 'app-user-edit',
    templateUrl: '../../../template/account/user-edit-panel/user-edit.html',
    styleUrls: ['../../../template/account/user-edit-panel/user-edit.scss']
})
export class UserEditComponent implements OnInit {

    @Input() tabId: string;
    userEditForm: FormGroup;
    customer: Customer;
    birthdate: string;
    public readonly genders = AppTexts.GENDERS;

    constructor(
        private service: CustomerService,
        private manager: CustomerManager,
        private parentRouter: Router,
        private route: ActivatedRoute,
        private builder: FormBuilder,
        private titleService: Title,
        @Inject(PLATFORM_ID) private platformId: Object
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
        if (isPlatformBrowser(this.platformId)) {
            this.titleService.setTitle('Alterar Meus Dados Cadastrais');
            let token: Token = this.getToken();
            this.service.getUser(token)
                .subscribe(user => {
                    this.customer = user;
                    this.birthdate = this.dateToText(this.customer.birthdate);
                }), (error => {
                    swal('Erro', 'Falha ao carregar o usuário', 'error');
                    console.log(error);
                });
        }
    }

    private getToken(): Token {
        let token = new Token();
        if (isPlatformBrowser(this.platformId)) {
            token = new Token();
            token.accessToken = localStorage.getItem('auth');
            token.createdDate = new Date(localStorage.getItem('auth_create'));
            token.expiresIn = Number(localStorage.getItem('auth_expires'));
            token.tokenType = 'Bearer';
        }
        return token;
    }

    dateToText(date) {
        return new Date(date).toISOString().substring(0, 10);
    }

    textToDate(event) {
        this.customer.birthdate = new Date(this.birthdate.split('-').map((item, index) => Number(item) - index % 2).toString());
    }

    validCPF(): boolean {
        return Validations.validCPF(this.customer.cpf_Cnpj);
    }
    validCNPJ(): boolean {
        return Validations.validCNPJ(this.customer.cpf_Cnpj);
    }

    strongPassword(): boolean {
        if (this.customer.password)
            return Validations.strongPassword(this.customer.password);
        else return true;
    }

    hasError(key: string): boolean {
        return (this.userEditForm.controls[key].touched && this.userEditForm.controls[key].invalid);
    }

    updateAccount(event) {
        event.preventDefault();
        if (isPlatformBrowser(this.platformId)) {
            if (this.userEditForm.invalid) {
                swal('Erro ao atualizar o cadastro', 'Os campos obrigatórios não foram preenchidos', 'warning');
            }
            else {
                let token: Token = this.getToken();
                this.service.updateCustomer(this.customer, token)
                    .subscribe(customer => {
                        swal('Dados Cadastrais atualizados', 'Seu cadastro foi atualizado', 'success');
                        this.manager.updateUserOnStorage(customer);
                        this.parentRouter.navigateByUrl(`/conta/home`);
                    }), (error => {
                        swal('Erro ao atualizar o cadastro', error.text(), 'error');
                    }
                    );
            }
        }
    }
}