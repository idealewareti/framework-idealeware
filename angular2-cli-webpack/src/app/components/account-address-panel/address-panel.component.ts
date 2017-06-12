import { Component, OnInit, Input } from '@angular/core';
import {Http} from '@angular/http';
import {Customer} from 'app/models/customer/customer';
import {CustomerAddress} from 'app/models/customer/customer-address';
import {CustomerService} from 'app/services/customer.service';

declare var swal: any;

@Component({
    moduleId: module.id,
    selector: 'address-panel',
    templateUrl: '../../views/address-panel.component.html',
})
export class AddressPanelComponent implements OnInit {
    @Input() tabId: string;
    addresses: CustomerAddress[] = [];
    

    constructor(private service: CustomerService) { 
        
    }

    ngOnInit() {
        this.service.getUser()
        .then(customer => {
            this.addresses = customer.addresses;
        })
        .catch(error => {
            swal({
                title: 'Não foi possível acessar obter os endereços',
                text: error._body,
                type: "error",
                confirmButtonText: "OK"
            });
            console.log(error);
        })
     }

    private isNewOrEdit(){
        if(this.tabId){
            return true;
        }
        else return false;
    }

    public handleAdressDeleted(event)
    {
        let address = new CustomerAddress(event);
        let index = this.addresses.findIndex(a => a.id == address.id);

        if(index > -1)
        {
            this.addresses.splice(index, 1);
        }
    }
}