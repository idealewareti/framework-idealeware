import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Order } from "../../../models/order/order";
import { ActivatedRoute, Router } from "@angular/router";
import { Title } from "@angular/platform-browser";

@Component({
    templateUrl: '../../../templates/checkout/budget-finish/budget-finish.html',
    styleUrls: ['../../../templates/checkout/budget-finish/budget-finish.scss']
})
export class BudgetFinishComponent {}
