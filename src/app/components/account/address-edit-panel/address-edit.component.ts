import { Component, Input, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerAddress } from '../../../models/customer/customer-address';
import { AppTexts } from '../../../app.texts';
import { isPlatformBrowser } from '@angular/common';
import { CustomerManager } from '../../../managers/customer.manager';
import { DneAddressManager } from '../../../managers/dneaddress.manager';

declare var swal: any;
declare var toastr: any;

@Component({
    selector: 'edit-address',
    templateUrl: '../../../templates/account/address-edit-panel/address-edit.html',
    styleUrls: ['../../../templates/account/address-edit-panel/address-edit.scss']
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
        private parentRouter: Router,
        private route: ActivatedRoute,
        private customerManager: CustomerManager,
        private dneManager: DneAddressManager,
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
        if (isPlatformBrowser(this.platformId)) {
            this.tabId = this.route.params['value'].id;
            if (this.tabId && this.tabId != 'novo') {
                this.isEdit = true;
                this.getAddress();
            }
            else {
                this.isEdit = false;
            }
        }
    }

    submit(event) {
        if (isPlatformBrowser(this.platformId)) {
            event.preventDefault();
            if (this.isEdit) this.update();
            else this.save();
        }
    }

    private save() {
        if (isPlatformBrowser(this.platformId)) {
            if (this.address.id) {
                this.update();
            } else {
                this.insert();
            }
        }
    }

    private insert() {
        if (isPlatformBrowser(this.platformId)) {
            this.customerManager.saveAddress(this.address)
                .subscribe(address => {
                    swal('Sucesso!', `Endereço ${address.addressName} cadastrado com sucesso!`, 'success');
                    this.parentRouter.navigateByUrl(`/conta/enderecos`)
                }), err => {
                    swal('Erro ao cadastrar novo endereço', err.error, 'error');
                };
        }
    }

    private update() {
        if (isPlatformBrowser(this.platformId)) {
            this.customerManager.updateAddress(this.address)
                .subscribe(address => {
                    swal('Sucesso!', `Endereço ${address.addressName} alterado com sucesso!`, 'success');
                    this.parentRouter.navigateByUrl(`/conta/enderecos`)
                }), (err => {
                    swal('Erro ao cadastrar novo endereço', err.error, 'error');
                });
        }
    }

    private getAddress() {
        if (isPlatformBrowser(this.platformId)) {
            this.customerManager.getUser()
                .subscribe(user => {
                    this.address = user.addresses.filter(a => a.id == this.tabId)[0]
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
                this.dneManager.getAddress(this.address.zipCode)
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

                    }), () => {
                        toastr['error']('Endereço não encontrado, preencha os campos manualmente');
                    };
            }
        }
    }

    hasError(key: string): boolean {
        if (isPlatformBrowser(this.platformId)) {
            let error: boolean = (this.myForm.controls[key].touched && this.myForm.controls[key].invalid);
            return error;
        }
    }

    invalidForm(): boolean {
        if (isPlatformBrowser(this.platformId)) {
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
    }

    validadeSubmit(event) {
        if (isPlatformBrowser(this.platformId)) {
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
}