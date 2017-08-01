import { Component, Input, AfterViewChecked, AfterContentChecked, AfterViewInit, OnInit, OnDestroy, OnChanges, Output, EventEmitter } from '@angular/core';
import { Http } from '@angular/http';
import { AppSettings } from 'app/app.settings';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { ServiceService } from "app/services/service.service";
import { Service } from "app/models/product-service/product-service";
import { ProductService } from "app/services/product.service";
import { Product } from "app/models/product/product";
import { CartManager } from "app/managers/cart.manager";
import { NgProgressService } from "ngx-progressbar";

declare var swal: any;

@Component({
    moduleId: module.id,
    selector: 'service',
    templateUrl: '../../views/service.component.html'
})
export class ServiceComponent {
    services: Service[] = [];
    servicesIds: Service[] = [];
    zipCode: string;
    productId: string;
    messageZipCode: string;
    totalService: number = 0;

    @Input() product: Product = new Product();
    @Input() selectedServices: Service[] = [];
    @Output() serviceUpdated: EventEmitter<Service> = new EventEmitter<Service>();

    constructor(
        private route: ActivatedRoute,
        private parentRouter: Router,
        private titleService: Title,
        private service: ServiceService,
        private productService: ProductService,
        private location: Location,
        private cartManager: CartManager,
        private loader: NgProgressService
    ) {
    }

    ngOnInit() {
        this.getServiceId();
    }


    private getServiceId() {
        if (this.product != null && this.product.services != null) {
            this.product.services.forEach(service => {
                this.servicesIds.push(service);
            });
        }
    }

    getService(event) {
        event.preventDefault();
        if (/\d{5}-\d{3}/.test(this.zipCode)) {
            this.service.getService(this.servicesIds, this.zipCode)
                .then(response => {
                    this.services = response;
                    if(this.services.length == 0){
                        swal("Nenhum serviço encontrado", "Não foi encontrado nenhum serviço para a sua localidade");
                    }
                })
                .catch(error => {
                    swal("Falha ao localizar serviços", "Não foi encontrado nenhum serviço no momento");
                    console.log(error);
                });
            this.messageZipCode = null;
        }
        else {
            this.messageZipCode = "O CEP deve conter 8 caracteres";
        }
    }

    addService(serviceId: string) {
        let serviceSelected = this.services.filter(s => s.id == serviceId)[0];
        if(serviceSelected.quantity == 0)
            swal("Quantidade não informada", "A quantidade mínima de serviços deve ser maior que zero");
        else{
            this.loader.start();
            this.serviceUpdated.emit(serviceSelected);
            this.loader.done();
        }
    }

    deleteService(serviceId: string, event) {
        event.preventDefault();
        let serviceSelected = this.services.filter(s => s.id == serviceId)[0];
        serviceSelected.quantity = 0;
        this.serviceUpdated.emit(serviceSelected);
        this.loader.done();
    }

    changeTotalService(id: string): number {
        let quantity = this.services.filter(s => s.id == id)[0].quantity;
        let price = this.services.filter(s => s.id == id)[0].price;

        if(quantity == 0)
            quantity = 1;

        return (quantity * price);

    }

    isServiceSelected(service: Service): boolean{
        if(this.selectedServices.findIndex(s => s.id == service.id) > -1)
            return true;
        else return false;
    }


}