import {CartItem} from './cart-item';
import {Customer} from '../customer/customer';
import { CustomerAddress } from '../customer/customer-address';
import { Coupon } from "../coupon/coupon";

export class Cart{
  id: string;
  products: CartItem[] = [];
  services: Object[];
  customer: Customer;
  deliveryAddress: CustomerAddress;
  billingAddress: CustomerAddress;
  shipping: Object;
  coupons: Coupon[] = [];
  totalProductsPrice: number;
  totalServicesPrice: number;
  totalFreightPrice: number;
  totalDiscountPrice: number;
  totalPurchasePrice: number;
  sessionId: string;
  zipCode: string;

  constructor(object = null){
      if(object) return this.createFromResponse(object);
  }


  createFromResponse(object): Cart{
        let model = new Cart();

        for(var k in object){
            if(k == 'products'){
                model.products = object.products.map(item => item = new CartItem(item));
            }
            else if(k == 'coupons'){
                model.coupons = object.coupons.map(item => item = new Coupon(item));
            }
            else if(k == 'customer'){
                model.customer = new Customer(object.customer);
            }
            else if(k == 'deliveryAddress'){
                model.deliveryAddress = new CustomerAddress(object.deliveryAddress);
            }
            else if(k == 'billingAddress'){
                model.billingAddress = new CustomerAddress(object.billingAddress);
            }
            else{
                model[k] = object[k];
            }
        }

        return model
  }

}