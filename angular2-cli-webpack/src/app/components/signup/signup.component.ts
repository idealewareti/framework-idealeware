import { Component, Input, AfterViewChecked, OnInit, AfterContentChecked } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Http } from '@angular/http';

import { AppSettings } from 'app/app.settings';
import { AppTexts } from 'app/app.texts';
import { Validations } from 'app/directives/validations';
import { Customer } from 'app/models/customer/customer';
import { CustomerAddress } from 'app/models/customer/customer-address';
import { CustomerService } from 'app/services/customer.service';
import { DneAddressService } from "app/services/dneaddress.service";
import { DneAddress } from "app/models/dne/dneaddress";
import { CartService } from "app/services/cart.service";
import { CartManager } from "app/managers/cart.manager";
import { strongPasswordValidator } from "app/directives/strong-password/strong-password.directive";
import { equalsValidator, equalsControlValidator } from "app/directives/equals/equals.directive";
import { FormHelper } from "app/helpers/formhelper";
import { NgProgressService } from "ngx-progressbar";
import { Title } from "@angular/platform-browser";

declare var $: any;
declare var swal: any;

@Component({
    moduleId: module.id,
    selector: 'signup-form',
    templateUrl: '../../views/signup.component.html'
})
export class SignUpComponent {
    customer: Customer;
    confirmPassword: string;
    myForm: FormGroup;

    public readonly genders = AppTexts.GENDERS;
    public readonly states = AppTexts.BRAZILIAN_STATES;
    public readonly addressTypes = AppTexts.ADDRESS_TYPES;
    public readonly strongPasswordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;

    constructor(
        formBuilder: FormBuilder,
        private formHelper: FormHelper,
        private service: CustomerService,
        private dneService: DneAddressService,
        private managerCart: CartManager,
        private parentRouter: Router,
        private loader: NgProgressService,
        private titleService: Title,

    ) {
        this.customer = new Customer({type: 1});
        AppSettings.setTitle('Cadastre-se', this.titleService);
        this.customer.addresses.push(new CustomerAddress());

        this.myForm = formBuilder.group({
            firstname_Companyname: ['', Validators.required],
            lastname_Tradingname: ['', Validators.required],
            cpf_Cnpj: ['', Validators.required],
            rg_Ie: [''],
            phone: ['', Validators.required],
            celPhone: ['', Validators.required],
            email: ['', Validators.required],
            password: ['', Validators.compose([
                strongPasswordValidator(this.strongPasswordRegex)
            ])],
            confirmPassword: ['', Validators.compose([
                Validators.required,
                Validators.minLength(6),
                equalsControlValidator('password')
            ])],
            gender: ['', Validators.required],
            birthdate: [''],
            zipCode: ['', Validators.required],
            addressType: ['', Validators.required],
            addressLine1: ['', Validators.required],
            addressLine2: [''],
            district: ['', Validators.required],
            city: ['', Validators.required],
            state: ['', Validators.required],
            number: ['', Validators.required],
            receivePromotionalAndNews: ['']
        });
    }

    ngOnInit() {}

    ngAfterContentChecked() {}

    signUp(event) {
        event.preventDefault();

        if(this.myForm.invalid){
            swal({
                title: 'Falha ao cadastrar',
                text: 'Os campos informados com * são obrigatórios',
                type: "error",
                confirmButtonText: "OK"
            });
            
            for(let i in this.myForm.controls){
                (<any>this.myForm.controls[i])._touched = true;
            }
        }
        else{
            this.customer.addresses[0].addressName = 'Endereço Padrão';
            this.service.createCustomer(this.customer)
                .then(response => {
                    this.service.login(this.customer.email, this.customer.password)
                        .then(() => {

                            this.managerCart.getCart()
                                .then(response => {
                                    if (response.products.length > 0)
                                        this.parentRouter.navigateByUrl(`/carrinho`);
                                    else
                                        this.parentRouter.navigateByUrl(`/`);
                                })
                                .catch(error => {
                                    this.parentRouter.navigateByUrl(`/`);
                                })
                        })
                        .catch(error => {
                            console.log(error);
                            this.parentRouter.navigateByUrl(`/login`)
                        });

                })
                .catch(error => {
                    let title = '';
                    let message = '';

                    if (error.status == 0) {
                        title = AppTexts.SIGNUP_ERROR_TITLE;
                        message = AppTexts.SIGNUP_API_OFFLINE;
                    }
                    else {
                        title = AppTexts.SIGNUP_ERROR_TITLE;
                        if (new RegExp(/\[(.*?)\]/g).test(error.text())){
                            let response = error.text().match(/\[(.*?)\]/g)
                            message = response[response.length - 1].replace('["', '').replace('"]', '');
                        }
                        else message = error.text();
                    }

                    swal({
                        title: title,
                        text: message,
                        type: "error",
                        confirmButtonText: "OK"
                    });
                });

        }


    }

    public errorMessage(message: string) {
        return message;
    }

    public validCPF(): boolean {
        return Validations.validCPF(this.customer.cpf_Cnpj);
    }
    public validCNPJ(): boolean {
        return Validations.validCNPJ(this.customer.cpf_Cnpj);
    }


    /**
     * Limpa o CPF/CNPJ quando mudar o tipo de pessoa
     * 
     * @memberOf SignUpComponent
     */
    public changeCustomerType(type: number, event = null) {
        if(event)
            event.preventDefault();
        this.customer.type = type;
        this.customer.cpf_Cnpj = '';
        this.formHelper.markFormAsUntouched(this.myForm);
    }

    public getDne(event) {
        event.preventDefault();
        if (this.customer.addresses[0] != null && this.customer.addresses[0].zipCode) {
            this.loader.start();

            this.dneService.getAddress(this.customer.addresses[0].zipCode)
                .then(response => {
                    this.customer.addresses[0].district = response.neighborhoods;
                    this.customer.addresses[0].city = response.city;
                    this.customer.addresses[0].addressLine1 = response.street;
                    this.customer.addresses[0].state = response.state;
                    this.loader.done();
                })
                .catch(error => { 
                    console.log(error);
                    this.loader.done();
                });
        }
    }

    public isMobile(): boolean{
        return AppSettings.isMobile();
    }

    hasError(key: string): boolean{
        return (this.myForm.controls[key].touched && this.myForm.controls[key].invalid);
    }
}