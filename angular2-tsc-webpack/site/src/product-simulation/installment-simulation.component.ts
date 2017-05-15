import { Component, Input, AfterViewChecked, OnInit, OnDestroy } from '@angular/core';
import { AppSettings } from '../app.settings';
import { Router } from "@angular/router";
import { PaymentService } from "../_services/payment.service";
import { Payment } from "../_models/payment/payment";
import { Sku } from "../_models/product/sku";

//declare var $: any;

@Component({
    moduleId: module.id,
    selector: 'installment-simulation',
    templateUrl: '/views/installment-simulation.component.html'
})
export class InstallmentSimulationComponent implements OnInit {
    @Input() sku: Sku;
    simulation: Payment[] = [];
    private id: string;
    constructor(private service: PaymentService) { }

    ngOnInit() { }

    ngAfterContentChecked() {
        if(this.id != this.sku.id)
            this.simulation = [];
    }

    getSimulation(event) {
        if(event)
            event.preventDefault();
        this.id = this.sku.id;
        this.service.simulateInstallmentsBySkuId(this.id)
            .then(simulation => {
                this.simulation = simulation;
                this.simulation[0].paymentMethods = this.simulation[0].paymentMethods.filter(m => m.type == 1);
            })
            .catch(error => {
                console.log(error);
            });
    }
}