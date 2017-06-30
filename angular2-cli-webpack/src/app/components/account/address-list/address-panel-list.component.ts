import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import{CustomerAddress} from 'app/models/customer/customer-address';
import{CustomerService} from 'app/services/customer.service';

declare var swal: any;

@Component({
    moduleId: module.id,
    selector: 'address-panel-list',
    templateUrl: '../../../views/address-panel-list.component.html',
})

export class AddressPanelListComponent implements OnInit {
    @Input() address: CustomerAddress;
    @Output() addressDeleted: EventEmitter<CustomerAddress> = new EventEmitter<CustomerAddress>();

    constructor(private service: CustomerService) {
        this.address = new CustomerAddress();
     }

    ngOnInit() { }

    askForDelete(){
        swal({
            title: 'Apagar endereço',
            text: `Deseja excluir o endereço ${this.address.addressName}?`,
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sim',
            cancelButtonText: 'Não'
        }, function(this){
            return new Promise((resolve, reject) => {
                resolve()  
            })
        }, function(){

        })
        .then(() => this.delete())
        .catch(error => console.log(error));
    }

    private delete(){
        this.service.deleteAddress(this.address.id)
        .then(() => {
            swal('Endereço removido');
            this.addressDeleted.emit(this.address);
        })
        .catch(error => {
            swal({
                title: 'Falha ao remover o endereço',
                text: error,
                type: 'error'
            })
            
        })
    }
}