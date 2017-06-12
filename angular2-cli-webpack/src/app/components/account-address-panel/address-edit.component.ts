import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppTexts } from 'app/app.texts';
import { CustomerAddress } from 'app/models/customer/customer-address';
import { CustomerService } from 'app/services/customer.service';
import { DneAddressService } from "app/services/dneaddress.service";

declare var swal: any;

@Component({
    moduleId: module.id,
    selector: 'edit-address',
    templateUrl: '../../views/address-edit.component.html',
})
export class NewAddressComponent implements OnInit {
    @Input() tabId: string;
    public readonly states = AppTexts.BRAZILIAN_STATES;
    public readonly addressTypes = AppTexts.ADDRESS_TYPES;
    myForm: FormGroup;
    address: CustomerAddress;
    private isEdit: boolean = false;

    constructor(
        builder: FormBuilder,
        private service: CustomerService,
        private dneService: DneAddressService,
        private parentRouter: Router,
        private route: ActivatedRoute,
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
        else this.isEdit = false;
    }

    submit(event) {
        event.preventDefault();
        if (this.isEdit) this.update();
        else this.save();
    }

    private save() {
        this.service.saveAddress(this.address)
            .then(address => {
                swal({
                    title: 'Sucesso!',
                    text: `Endereço ${address.addressName} cadastrado com sucesso!`,
                    type: 'success',
                    confirmButtonText: 'OK'
                });
                this.parentRouter.navigateByUrl(`/conta/enderecos`)
            })
            .catch(error => {
                swal({
                    title: 'Erro ao cadastrar novo endereço',
                    text: error,
                    type: 'success',
                    confirmButtonText: 'OK'
                });
                console.log(error);
            });
    }

    private update() {
        this.service.updateAddress(this.address)
            .then(address => {
                swal({
                    title: 'Sucesso!',
                    text: `Endereço ${address.addressName} alterado com sucesso!`,
                    type: 'success',
                    confirmButtonText: 'OK'
                });
                this.parentRouter.navigateByUrl(`/conta/enderecos`)
            })
            .catch(error => {
                swal({
                    title: 'Erro ao cadastrar novo endereço',
                    text: error,
                    type: 'success',
                    confirmButtonText: 'OK'
                });
                console.log(error);
            });
    }

    private getAddress() {
        this.service.getUser()
            .then(user => this.address = user.addresses.filter(a => a.id == this.tabId)[0])
            .catch(error => {
                swal(error);
                this.parentRouter.navigateByUrl(`/conta/enderecos`)
            });
    }

    public getDne(event) {
        event.preventDefault();
        if (this.address != null && this.address.zipCode) {

            this.dneService.getAddress(this.address.zipCode)
                .then(response => {
                    this.address.district = response.neighborhoods;
                    this.address.city = response.city;
                    this.address.addressLine1 = response.street;
                    this.address.state = response.state;
                })
                .catch(error => { console.log(error) });
        }
    }
}