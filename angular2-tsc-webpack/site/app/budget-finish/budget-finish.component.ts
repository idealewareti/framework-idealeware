import { Component, OnInit } from '@angular/core';
import { Order } from "../_models/order/order";
import { OrderService } from "../_services/order.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Title } from "@angular/platform-browser";
import { AppSettings } from "../app.settings";
import { BudgetService } from "../_services/budget-service";

@Component({
    moduleId: module.id,
    selector: 'budget-finish',
    templateUrl: '/views/budget-finish.component.html',
})
export class BudgetFinishComponent implements OnInit {
    order: Order = new Order();

    constructor(
        private route:ActivatedRoute,
        private parentRouter: Router, 
        private titleService: Title,
    ) { }

    ngOnInit() {
        AppSettings.setTitle('Seu Orçamento Foi Gerado', this.titleService);
     }

    
}