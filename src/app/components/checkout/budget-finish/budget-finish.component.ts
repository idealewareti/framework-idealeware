import { Component, OnInit } from '@angular/core';
import { Order } from "../../../models/order/order";
import { OrderService } from "../../../services/order.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Title } from "@angular/platform-browser";
import { BudgetService } from "../../../services/budget.service";

@Component({
    moduleId: module.id,
    selector: 'budget-finish',
    templateUrl: '../../../template/checkout/budget-finish/budget-finish.html',
    styleUrls: ['../../../template/checkout/budget-finish/budget-finish.scss']
})
export class BudgetFinishComponent implements OnInit {
    order: Order = new Order();

    constructor(
        private route: ActivatedRoute,
        private parentRouter: Router,
        private titleService: Title,
    ) { }

    ngOnInit() {
        this.titleService.setTitle('Seu Orçamento Foi Gerado');
    }
}
