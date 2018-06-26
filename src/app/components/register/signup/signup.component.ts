import { Component, Input, AfterViewChecked, OnInit, AfterContentChecked, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Title } from "@angular/platform-browser";
import { Customer } from '../../../models/customer/customer';
import { FormHelper } from '../../../helpers/formhelper';
import { AppTexts } from '../../../app.texts';
import { CustomerManager } from '../../../managers/customer.manager';
import { DneAddressService } from '../../../services/dneaddress.service';
import { CartManager } from '../../../managers/cart.manager';
import { CustomerAddress } from '../../../models/customer/customer-address';
import { strongPasswordValidator } from '../../../directives/strong-password/strong-password.directive';
import { Validations } from '../../../directives/validations';
import { equalsControlValidator } from '../../../directives/equals/equals.directive';
import { AppCore } from '../../../app.core';
import { isPlatformBrowser } from '@angular/common';

declare var $: any;
declare var swal: any;
declare var toastr: any;

@Component({
    moduleId: module.id,
    selector: 'app-signup-form',
    templateUrl: '../../../template/register/signup/signup.html',
    styleUrls: ['../../../template/register/signup/signup.scss']
})
export class SignUpComponent {
    customer: Customer;
    confirmPassword: string;
    myForm: FormGroup;

    public readonly genders = AppTexts.GENDERS;
    public readonly states = AppTexts.BRAZILIAN_STATES;
    public readonly addressTypes = AppTexts.ADDRESS_TYPES;
    public readonly strongPasswordRegex = /(?=.*\d)(?=.*[a-z]).{6,}/;

    constructor(
        formBuilder: FormBuilder,
        private formHelper: FormHelper,
        private manager: CustomerManager,
        private dneService: DneAddressService,
        private cartManager: CartManager,
        private parentRouter: Router,
        private titleService: Title,
        @Inject(PLATFORM_ID) private platformId: Object,
    ) {
        this.customer = new Customer({ type: 1, gender: 'M' });
        this.titleService.setTitle('Cadastre-se');
        this.customer.addresses.push(new CustomerAddress({ addressType: 1 }));

        this.myForm = formBuilder.group({
            firstname_Companyname: ['', Validators.required],
            lastname_Tradingname: ['', Validators.required],
            cpf_Cnpj: ['', Validators.required],
            rg_Ie: [''],
            phone: ['', Validators.required],
            celPhone: [''],
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

    ngOnInit() { }

    ngAfterContentChecked() { }

    ngAfterViewInit(){
        if (isPlatformBrowser(this.platformId)) {
            $('.date').mask('00/00/0000');
        }
    }
    
    signUp(event) {
        event.preventDefault();

        if (this.invalidForm()) {
            swal({
                title: 'Falha ao cadastrar',
                text: 'Os campos informados com * são obrigatórios',
                type: "error",
                confirmButtonText: "OK"
            });

            for (let i in this.myForm.controls) {
                (<any>this.myForm.controls[i])._touched = true;
            }
        }
        else {
            this.customer.addresses[0].addressName = 'Endereço Padrão';
            if(this.customer.type == 1){
                this.customer.birthdate = AppCore.ConvertTextToDate(this.customer.date);
            }
            this.manager.signUp(this.customer)
                .then(response => {
                    let cartId = localStorage.getItem('cart_id');
                    if (cartId)
                        this.parentRouter.navigateByUrl(`/checkout`);
                    else {
                        this.parentRouter.navigateByUrl(`/`);
                    }
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
                        if (new RegExp(/\[(.*?)\]/g).test(error.text())) {
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
        if (event)
            event.preventDefault();
        this.customer.type = type;
        this.customer.cpf_Cnpj = '';
        this.formHelper.markFormAsUntouched(this.myForm);
    }

    public getDne(event) {
        event.preventDefault();
        if (this.customer.addresses[0] != null && this.customer.addresses[0].zipCode) {
            toastr['info']('Localizando o endereço');
            this.dneService.getAddress(this.customer.addresses[0].zipCode)
                .subscribe(response => {
                    this.customer.addresses[0].district = response.neighborhoods;
                    this.customer.addresses[0].city = response.city;
                    this.customer.addresses[0].addressLine1 = response.street;
                    this.customer.addresses[0].state = response.state;
                    if (response.street) {
                        toastr['success']('Endereço encontrado');
                    }
                    else {
                        toastr['warning']('Endereço não encontrado, preencha os campos manualmente');
                    }
                }), error => {
                    console.log(error);
                    toastr['error']('Endereço não encontrado, preencha os campos manualmente');
                };
        }
    }

    isMobile(): boolean {
        if (isPlatformBrowser(this.platformId)) {
            return AppCore.isMobile(window);
        }
        else return false;
    }

    hasError(key: string): boolean {
        let error: boolean = (this.myForm.controls[key].touched && this.myForm.controls[key].invalid);
        return error;
    }

    invalidForm(): boolean {
        if (this.myForm.invalid && this.customer.type == 1)
            return true;
        else if (this.myForm.invalid && this.customer.type == 1) {
            let errors = [];
            for (let i in this.myForm.controls) {
                if ((<any>this.myForm.controls[i]).invalid)
                    errors.push(i)
            }

            if (errors.length == 1 && errors[0] == 'birthdate')
                return false;
            else return true;
        }
        else return false;
    }

    errorCPF_CNPJ(): boolean {
        if (this.customer.type == 1 && (this.hasError('cpf_Cnpj') || (!this.validCPF() && this.validCPF() != null)))
            return true;
        else if (this.customer.type == 2 && (this.hasError('cpf_Cnpj') || (!this.validCNPJ() && this.validCNPJ() != null)))
            return true;
        else return false;
    }
}