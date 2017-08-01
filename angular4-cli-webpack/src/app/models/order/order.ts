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
import { Paint } from "app/models/custom-paint/custom-paint";

export class Order {
    id: string;
    domain: string;
    orderNumber: string;
    nfeKey: string;
    ip: CustomerIp;
    products: Product[] = [];
    services: Service[] = [];
    paints: Paint[] = [];
    customer: Customer;
    deliveryAddress: CustomerAddress;
    billingAddress: CustomerAddress;
    shipping: Shipping;
    coupons: Coupon[] = [];
    payment: Payment;
    createdDate: Date;
    status: OrderStatusEnum;
    historyStatus: HistoryStatus[] = [];
    sessionId: string;
    zipCode: number;
    
    totalProductsPrice: number;
    totalFreightPrice: number;
    totalDiscountPrice: number;
    totalServicePrice: number;
    totalPaintsPrice: number;
    orderPrice: number;

    constructor(object = null) {
        if (object) return this.createFromResponse(object);
    }

    public createFromResponse(response): Order {
        let model = new Order();

        for (var k in response) {

            if (k == 'products' && response[k]) {
                model.products = response.products.map(product => product = new Product(product));
            }
            else if (k == 'services' && response[k]) {
                model.services = response.services.map(service => service = new Service(service));
            }
            else if (k == 'paints' && response[k]) {
                model[k] = response[k].map(paint => paint = new Paint(paint));
            }
            else if (k == 'coupons' && response[k]) {
                model.coupons = response.coupons.map(coupon => coupon = new Coupon(coupon));
            }
            else if (k == 'historyStatus' && response[k]) {
                model.historyStatus = response.historyStatus.map(status => status = new HistoryStatus(status));
            }
            else if (k == 'ip') {
                model.ip = new CustomerIp(response[k]);
            }
            else if (k == 'customer') {
                model.customer = new Customer(response[k]);
            }
            else if (k == 'deliveryAddress') {
                model.deliveryAddress = new CustomerAddress(response[k]);
            }
            else if (k == 'billingAddress') {
                model.deliveryAddress = new CustomerAddress(response[k]);
            }
            else if (k == 'shipping') {
                model.shipping = new Shipping(response[k]);
            }
            else if (k == 'payment') {
                model.payment = new Payment(response[k]);
            }
            else if (k == 'createdDate') {
                model.createdDate = new Date(response[k]);
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
