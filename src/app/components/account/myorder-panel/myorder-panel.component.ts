import { Component, Input, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { OrderService } from "../../../services/order.service";
import { Order } from "../../../models/order/order";
import { OrderStatusEnum } from "../../../enums/order-status.enum";
import { Title } from "@angular/platform-browser";
import { Globals } from "../../../models/globals";
import { Token } from '../../../models/customer/token';
import { isPlatformBrowser } from '@angular/common';
import { StoreService } from '../../../services/store.service';
import { Store } from '../../../models/store/store';

declare var swal: any;

@Component({
    moduleId: module.id,
    selector: 'app-myorder-panel',
    templateUrl: '../../../template/account/myorder-panel/myorder-panel.html',
    styleUrls: ['../../../template/account/myorder-panel/myorder-panel.scss'],
})
export class MyOrderPanelComponent implements OnInit {
    @Input() tabId: string;
    order: Order = null;
    mediaPath: string;
    mediaPathPaint: string;
    store: Store;

    constructor(
        private route: ActivatedRoute,
        private service: OrderService,
        private storeService: StoreService,
        private parentRouter: Router,
        private titleService: Title,
        private globals: Globals,
        @Inject(PLATFORM_ID) private platformId: Object
    ) { }


    private getToken(): Token {
        let token = new Token();
        if (isPlatformBrowser(this.platformId)) {
            token = new Token();
            token.accessToken = localStorage.getItem('auth');
            token.createdDate = new Date(localStorage.getItem('auth_create'));
            token.expiresIn = Number(localStorage.getItem('auth_expires'));
            token.tokenType = 'Bearer';
        }
        return token;
    }

    private fetchStore(): Promise<Store> {
        return new Promise((resolve, reject) => {
            this.storeService.getStore()
                .subscribe(response => {
                    let store: Store = new Store(response);
                    resolve(store);
                }, error => {
                    reject(error);
                });
        });
    }

    ngOnInit() {
        if (isPlatformBrowser(this.platformId)) {
            this.tabId = this.route.params['value'].id;
            this.fetchStore()
                .then(store => {
                    this.store = store;
                    this.mediaPath = `${this.store.link}/static/products/`;
                    this.mediaPathPaint = `${this.store.link}/static/custompaint/`;
                    return this.getOrder(this.tabId, this.getToken());
                })
                .then(order => {
                    this.order = order;
                    this.titleService.setTitle(`Pedido #${this.order.orderNumber}`);
                })
                .catch(error => {
                    swal('Erro ao exibir o pedido', error.text(), 'error');
                    this.parentRouter.navigateByUrl('/conta/pedidos');
                });
        }
    }

    getOrder(orderId: string, token: Token): Promise<Order> {
        return new Promise((resolve, reject) => {
            this.service.getOrder(this.tabId, this.getToken())
                .subscribe(order => {
                    resolve(order);
                }), (error => {
                    reject(error);
                })
        });
    }

    orderPipeline() {
        if (this.order.status == OrderStatusEnum.NewOrder || this.order.status == OrderStatusEnum.PendingOrder)
            return 1;
        else if (this.order.status == OrderStatusEnum.ApprovedOrder || this.order.status == OrderStatusEnum.FaturedOrder || this.order.status == OrderStatusEnum.ProcessOrder)
            return 2;
        else if (this.order.status == OrderStatusEnum.TransportedOrder)
            return 3;
        else if (this.order.status == OrderStatusEnum.FinishedOrder)
            return 5;
        else return 0;
    }

    isCreditCard(): boolean {
        if (this.order.payment.paymentMethods.length > 0 && this.order.payment.paymentMethods[0].type == 1)
            return true;
        else return false;
    }

    isBankSlip(): boolean {
        if (this.order.payment.paymentMethods.length > 0 && this.order.payment.paymentMethods[0].type == 2)
            return true;
        else return false;
    }

    isHiddenVariation(): boolean {
        let type = this.globals.store.settings.find(s => s.type == 4);
        if (type)
            return type.status;
        else
            return false;
    }

    getDiscount() {
        return this.order.totalDiscountPrice;
    }

    getShipping() {
        return this.order.totalFreightPrice;
    }

    getSubTotal() {
        return this.order.totalProductsPrice + this.order.totalServicePrice + this.order.totalPaintsPrice;
    }

    getTotal() {
        return this.order.orderPrice;
    }

    getTotalServices(): number {
        return this.order.totalServicePrice;
    }

    getTotalProducts(): number {
        return this.order.totalProductsPrice
    }

    getTotalPaints(): number {
        return this.order.totalPaintsPrice;
    }

    getNumItemsInCart() {
        if (this.order) {
            let numItems = 0;
            numItems += (this.order.products) ? this.order.products.length : 0;
            numItems += (this.order.services) ? this.order.services.length : 0;
            numItems += (this.order.paints) ? this.order.paints.length : 0;

            return numItems;
        }
        else return 0;
    }
}