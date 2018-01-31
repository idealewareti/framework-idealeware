import { Component, Input, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from "@angular/platform-browser";
import { CustomerAddress } from '../../../models/customer/customer-address';
import { CustomerService } from '../../../services/customer.service';
import { AppTexts } from '../../../app.texts';
import { DneAddressService } from '../../../services/dneaddress.service';
import { isPlatformBrowser } from '@angular/common';
import { Token } from '../../../models/customer/token';

declare var swal: any;
declare var toastr: any;

@Component({
    moduleId: module.id,
    selector: 'app-edit-address',
    templateUrl: '../../../template/account/address-edit-panel/address-edit.html',
    styleUrls: ['../../../template/account/address-edit-panel/address-edit.scss']
})
export class AddressEditComponent implements OnInit {
    @Input() tabId: string;
    readonly states = AppTexts.BRAZILIAN_STATES;
    public readonly addressTypes = AppTexts.ADDRESS_TYPES;
    myForm: FormGroup;
    address: CustomerAddress;
    isEdit: boolean = false;


    constructor(
        builder: FormBuilder,
        private service: CustomerService,
        private dneService: DneAddressService,
        private parentRouter: Router,
        private route: ActivatedRoute,
        private titleService: Title,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {
        this.address = new CustomerAddress();
        this.myForm = builder.group({
            addressName: ['', Validators.required],
            addressType: ['', Validators.required],
            zipCode: ['', Validators.required],
            addressLine1: ['', Validators.required],
            addressLine2: [''],
            landmark: [''],
            district: ['', Validators.required],
            city: ['', Validators.required],
            state: ['', Validators.required],
            number: ['', Validators.required],
        });
    }

    ngOnInit() {
        this.tabId = this.route.params['value'].id;
        if (this.tabId && this.tabId != 'novo') {
            this.isEdit = true;
            this.getAddress();
        }
        else {
            this.isEdit = false;
            this.titleService.setTitle('Cadastar Novo Endereço');
        }
    }

    submit(event) {
        event.preventDefault();
        if (this.isEdit) this.update();
        else this.save();
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

    private save() {
        if (isPlatformBrowser(this.platformId)) {
            let token: Token = this.getToken();
            this.service.saveAddress(this.address, token)
                .subscribe(address => {
                    swal('Sucesso!', `Endereço ${address.addressName} cadastrado com sucesso!`, 'success');
                    this.parentRouter.navigateByUrl(`/conta/enderecos`)
                }), error => {
                    swal('Erro ao cadastrar novo endereço', error, 'error');
                    console.log(error);
                };
        }
    }

    private update() {
        if (isPlatformBrowser(this.platformId)) {
            let token: Token = this.getToken();
            this.service.updateAddress(this.address, token)
                .subscribe(address => {
                    swal('Sucesso!', `Endereço ${address.addressName} alterado com sucesso!`, 'success');
                    this.parentRouter.navigateByUrl(`/conta/enderecos`)
                }), (error => {
                    swal('Erro ao cadastrar novo endereço', error, 'error');
                    console.log(error);
                });
        }
    }

    private getAddress() {
        if (isPlatformBrowser(this.platformId)) {
            let token: Token = this.getToken();
            this.service.getUser(token)
                .subscribe(user => {
                    this.address = user.addresses.filter(a => a.id == this.tabId)[0]
                    this.titleService.setTitle('Editar Endereço');
                }), error => {
                    swal(error);
                    this.parentRouter.navigateByUrl(`/conta/enderecos`)
                };
        }
    }

    getDne(event) {
        if (isPlatformBrowser(this.platformId)) {
            event.preventDefault();
            if (this.address != null && this.address.zipCode) {
                toastr['info']('Localizando o endereço');
                this.dneService.getAddress(this.address.zipCode)
                    .subscribe(response => {
                        this.address.district = response.neighborhoods;
                        this.address.city = response.city;
                        this.address.addressLine1 = response.street;
                        this.address.state = response.state;
                        if (response.street) {
                            toastr['success']('Endereço encontrado');
                        }
                        else {
                            toastr['warning']('Endereço não encontrado, preencha os campos manualmente');
                        }

                    }), error => {
                        toastr['error']('Endereço não encontrado, preencha os campos manualmente');
                        console.log(error)
                    };
            }
        }
    }

    hasError(key: string): boolean {
        let error: boolean = (this.myForm.controls[key].touched && this.myForm.controls[key].invalid);
        return error;
    }

    invalidForm(): boolean {
        if (this.myForm.invalid) {
            let errors = [];
            for (let i in this.myForm.controls) {
                if ((<any>this.myForm.controls[i]).invalid)
                    errors.push(i)
            }

            if (errors.length == 0)
                return false;
            else return true;
        }
        else return false;
    }

    validadeSubmit(event) {
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
        } else {
            this.save();
        }
    }
}