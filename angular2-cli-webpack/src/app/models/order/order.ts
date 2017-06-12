import { Product } from "../product/product";
import { Customer } from "../customer/customer";
import { CustomerAddress } from "../customer/customer-address";
import { CustomerIp } from "../customer/customer-ip";
import { Service } from "../product-service/product-service";
import { DeliveryInformation } from "../shipping/delivery-information";
import { Coupon } from "../coupon/coupon";
import { Payment } from "../payment/payment";
import { HistoryStatus } from "./history-status";
import { Shipping } from "../shipping/shipping";
import { OrderStatusEnum } from "app/enums/order-status.enum";

export class Order {
    id: string;
    domain: string;
    orderNumber: string;
    nfeKey: string;
    ip: CustomerIp;
    products: Product[] = [];
    services: Service[] = [];
    customer: Customer;
    deliveryAddress: CustomerAddress;
    billingAddress: CustomerAddress;
    shipping: Shipping;
    coupons: Coupon[] = [];
    payment: Payment;
    createdDate: Date;
    status: OrderStatusEnum;
    historyStatus: HistoryStatus[] = [];
    totalProductsPrice: number;
    totalFreightPrice: number;
    totalDiscountPrice: number;
    totalServicePrice: number;
    orderPrice: number;
    sessionId: string;
    zipCode: number;

    constructor(object = null) {
        if (object) return this.createFromResponse(object);
    }

    public createFromResponse(response): Order {
        let model = new Order();

        for (var k in response) {

            if (k == 'products') {
                model.products = response.products.map(o => o = new Product(o));
            }
            else if (k == 'services') {
                model.services = response.services.map(o => o = new Service(o));
            }
            else if (k == 'coupons') {
                model.coupons = response.coupons.map(o => o = new Coupon(o));
            }
            else if (k == 'historyStatus') {
                model.historyStatus = response.historyStatus.map(o => o = new HistoryStatus(o));
            }
            else if (k == 'ip') {
                model.ip = new CustomerIp(response.CustomerIp);
            }
            else if (k == 'customer') {
                model.customer = new Customer(response.Customer);
            }
            else if (k == 'deliveryAddress') {
                model.deliveryAddress = new CustomerAddress(response.deliveryAddress);
            }
            else if (k == 'shipping') {
                model.shipping = new Shipping(response.shipping);
            }
            else if (k == 'payment') {
                model.payment = new Payment(response.payment);
            }
            else if (k == 'createdDate') {
                model.createdDate = new Date(response.createdDate);
            }
            else {
                model[k] = response[k];
            }
        }

        return model;
    }


    public labelStatus(): string {

        let status = [
            { id: 0, label: 'Novo Pedido' },
            { id: 1, label: 'Pedido Aprovado' },
            { id: 2, label: 'Em Transporte' },
            { id: 3, label: 'Pedido Concluído' },
            { id: 10, label: 'Pedido Faturado' },
            { id: 11, label: 'Pendente' },
            { id: 12, label: 'Pedido Cancelado' },
            { id: 13, label: 'Em Processamento' }
        ]

        return status.filter(s => s.id == this.status)[0].label;
    }
}
