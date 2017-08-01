import { Injectable } from "@angular/core";
import { Cart } from "app/models/cart/cart";

@Injectable()
export class Globals {
  cart: Cart = new Cart();
}