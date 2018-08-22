import { Component, Input, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppTexts } from '../../../app.texts';
import { Validations } from '../../../directives/validations';
import { Customer } from '../../../models/customer/customer';
import { isPlatformBrowser } from '@angular/common';
import { CustomerManager } from '../../../managers/customer.manager';

declare var swal: any;

@Component({
    selector: 'user-edit',
    templateUrl: '../../../templates/account/user-edit-panel/user-edit.html',
    styleUrls: ['../../../templates/account/user-edit-panel/user-edit.scss']
})
export class UserEditComponent implements OnInit {

    @Input() tabId: string;
    userEditForm: FormGroup;
    customer: Customer;
    birthdate: string;
    public readonly genders = AppTexts.GENDERS;

    constructor(
        private manager: CustomerManager,
        private parentRouter: Router,
        builder: FormBuilder,
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
        this.manager.getUser()
            .subscribe(user => {
                this.customer = user;
                this.birthdate = this.dateToText(this.customer.birthdate);
            }), (error => {
                swal('Erro', 'Falha ao carregar o usuário', 'error');
            });
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
                this.manager.updateCustomer(this.customer)
                    .then(() => {
                        swal('Dados Cadastrais atualizados', 'Seu cadastro foi atualizado', 'success');
                        this.parentRouter.navigateByUrl(`/conta/home`);
                    }).catch(err => {
                        swal('Erro ao atualizar o cadastro', err, 'error');
                    });
            }
        }
    }
}