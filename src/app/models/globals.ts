import { Injectable } from "@angular/core";
import { Cart } from "app/models/cart/cart";
import { Store } from "app/models/store/store";

@Injectable()
export class Globals {
  cart: Cart = new Cart();
  store: Store = null;
}