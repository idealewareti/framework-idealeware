import { Injectable } from "@angular/core";
import { CanDeactivate, Router } from "@angular/router";
import { CheckoutComponent } from "../components/checkout/checkout/checkout.component";

declare var swal;

@Injectable({
    providedIn: 'root'
})
export class CheckoutGuard implements CanDeactivate<CheckoutComponent> {
    canDeactivate(component: CheckoutComponent): boolean {
        const process: boolean = component.hasProcessCheckout();
        if (process) {
            swal('Atenção', 'Processo de compra em andamento.', 'warning');
            return !component.hasProcessCheckout();
        }
        return true;
    }
}