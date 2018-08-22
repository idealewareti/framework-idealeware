import { Product } from "../product/product";
import { Customer } from "../customer/customer";
import { CustomerAddress } from "../customer/customer-address";
import { CustomerIp } from "../customer/customer-ip";
import { Service } from "../product-service/product-service";
import { Coupon } from "../coupon/coupon";
import { Payment } from "../payment/payment";
import { HistoryStatus } from "./history-status";
import { Shipping } from "../shipping/shipping";
import { OrderStatusEnum } from "../../enums/order-status.enum";

export class Order {
    id: string;
    domain: string;
    orderNumber: string;
    nfeKey: string;
    ip: CustomerIp;
    products: Product[];
    services: Service[];
    customer: Customer;
    deliveryAddress: CustomerAddress;
    billingAddress: CustomerAddress;
    shipping: Shipping;
    coupons: Coupon[];
    payment: Payment;
    createdDate: Date;
    status: OrderStatusEnum;
    historyStatus: HistoryStatus[];
    sessionId: string;
    zipCode: number;
    totalProductsPrice: number;
    totalFreightPrice: number;
    totalDiscountPrice: number;
    totalServicePrice: number;
    orderPrice: number;
    labelStatus: string;
}
