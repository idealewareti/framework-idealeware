import { Component, Input, AfterViewChecked, OnInit, OnDestroy } from '@angular/core';
import { AppSettings } from 'app/app.settings';
import { Router } from "@angular/router";
import { Payment } from "app/models/payment/payment";
import { Sku } from "app/models/product/sku";
import { PaymentManager } from "app/managers/payment.manager";
import { PaymentMethodTypeEnum } from "app/enums/payment-method-type.enum";
import { PaymentMethod } from "app/models/payment/payment-method";

//declare var $: any;

@Component({
    moduleId: module.id,
    selector: 'installment-simulation',
    templateUrl: '../../views/installment-simulation.component.html'
})
export class InstallmentSimulationComponent implements OnInit {
    @Input() sku: Sku;
    payments: Payment[] = [];
    simulation: Payment = new Payment();
    private id: string;

    static mediaPath = `${AppSettings.ROOT_PATH}/assets/images/`;

    constructor(private manager: PaymentManager) { }

    ngOnInit() {
        this.manager.getAll()
        .then(payments => this.payments = payments);
     }

    ngAfterContentChecked() {
        if(this.id != this.sku.id)
            this.simulation.paymentMethods = [];
    }

    getSimulation(event = null) {
        if(event)
            event.preventDefault();
        this.id = this.sku.id;
        this.manager.simulateInstallmentsBySkuId(this.id)
        .then(simulations => {
            if(this.manager.hasMundipaggCreditCard(simulations)){
                this.simulation = this.manager.getMundipaggCreditCard(simulations);
            }
        })
        .catch(error => {
            console.log(error);
        });
    }

    hasSimulation(): boolean{
        return this.manager.hasMundipaggCreditCard(this.payments);
    }

    nonEmptyMethod(): PaymentMethod[]{
        return this.simulation.paymentMethods.filter(m => m.installment.length > 0);
    }

    getMaxInstallment(method: PaymentMethod): number{
        return method.installment[method.installment.length -1].number;
    }

}