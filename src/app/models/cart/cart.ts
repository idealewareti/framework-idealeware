import { CartItem } from './cart-item';
import { Customer } from '../customer/customer';
import { CustomerAddress } from '../customer/customer-address';
import { Coupon } from "../coupon/coupon";
import { Paint } from '../custom-paint/custom-paint';
import { Service } from '../product-service/product-service';
import { Shipping } from '../shipping/shipping';

export class Cart {
    id: string;
    products: CartItem[] = [];
    paints: Paint[] = [];
    services: Service[] = [];
    customer: Customer;
    deliveryAddress: CustomerAddress;
    billingAddress: CustomerAddress;
    shipping: Shipping;
    coupons: Coupon[] = [];
    totalProductsPrice: number;
    totalServicesPrice: number;
    totalCustomPaintPrice: number;
    totalFreightPrice: number;
    totalDiscountPrice: number;
    totalPurchasePrice: number;
    sessionId: string;
    zipCode: string;
    origin: string;

    constructor(object = null) {
        if (object) return this.createFromResponse(object);
    }


    createFromResponse(object): Cart {
        let model = new Cart();

        for (var k in object) {
            if (k == 'products') {
                model.products = object.products.map(item => item = new CartItem(item));
            }
            else if (k == 'services') {
                model.services = object.services.map(service => service = new Service(service));
            }
            else if (k == 'coupons') {
                model.coupons = object.coupons.map(item => item = new Coupon(item));
            }
            else if (k == 'customer') {
                model.customer = new Customer(object.customer);
            }
            else if (k == 'deliveryAddress') {
                model.deliveryAddress = new CustomerAddress(object.deliveryAddress);
            }
            else if (k == 'billingAddress') {
                model.billingAddress = new CustomerAddress(object.billingAddress);
            }
            else if (k == 'paints') {
                model[k] = object[k].map(paint => new Paint(paint));
            }
            else if (k == 'services') {
                model[k] = object[k].map(service => new Service(service));
            }
            else if (k == 'shipping') {
                model.shipping = new Shipping(object[k]);
            }
            else {
                model[k] = object[k];
            }
        }

        return model
    }

}