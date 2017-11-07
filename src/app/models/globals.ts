import { Injectable } from "@angular/core";
import { Cart } from "./cart/cart";
import { Store } from "./store/store";

@Injectable()
export class Globals {
  cart: Cart = new Cart();
  store: Store = null;
}