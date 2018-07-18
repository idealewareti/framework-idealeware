import { Component, Input, AfterViewChecked, OnInit, OnDestroy, Inject, PLATFORM_ID, SimpleChanges } from '@angular/core';
import { Router } from "@angular/router";
import { isPlatformBrowser } from '@angular/common';
import { Payment } from "../../../models/payment/payment";
import { Sku } from "../../../models/product/sku";
import { PaymentManager } from "../../../managers/payment.manager";
import { PaymentMethodTypeEnum } from "../../../enums/payment-method-type.enum";
import { PaymentMethod } from "../../../models/payment/payment-method";
import { Installment } from "../../../models/payment/installment";
import { PagseguroInstallment } from "../../../models/pagseguro/pagseguro-installment";
import { PaymentSetting } from "../../../models/payment/payment-setting";
import { Globals } from '../../../models/globals';
import { InstallmentsSimulation } from '../../../models/payment/installments-simulation';



declare var $: any;
declare var swal: any;
declare var PagSeguroDirectPayment: any;

@Component({
    moduleId: module.id,
    selector: 'app-installment-simulation',
    templateUrl: '../../../template/product/installment-simulation/installment-simulation.html',
    styleUrls: ['../../../template/product/installment-simulation/installment-simulation.scss']
})
export class InstallmentSimulationComponent implements OnInit {
    @Input() sku: Sku;
    @Input() isSimpleSimulation: Boolean;
    payments: Payment[] = [];
    simulation: Payment = new Payment();
    gatewaySelected: Payment = new Payment();
    private id: string;
    error: string;
    installments: InstallmentsSimulation = new InstallmentsSimulation();

    mediaPath: string;

    constructor(
        private manager: PaymentManager,
        private globals: Globals,
        @Inject(PLATFORM_ID) private platformId: Object
    ) { }

    ngOnInit() {
        if (isPlatformBrowser(this.platformId)) {
            this.mediaPath = `${this.globals.store.link}/assets/images/`;
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (isPlatformBrowser(this.platformId)) {
            if (changes['sku'] && changes['isSimpleSimulation'] && this.isSimpleSimulation) {
                this.getSimulationSimple();
            }
        }
    }

    getSimulationSimple() {
        this.manager.getInstallmentsSimulationSimpleBySkuId(this.sku.id)
            .then(installments => this.installments = installments)
            .catch(error => console.log(`Erro ao buscar parcelamentos: ${error}`));
    }

    ngAfterContentChecked() {
        if (this.id != this.sku.id)
            this.simulation.paymentMethods = [];
    }

    getSimulation(event = null) {
        if (event)
            event.preventDefault();
        this.error = null;
        this.id = this.sku.id;
        this.payments = [];
        this.manager.simulateInstallmentsBySkuId(this.id)
            .then(simulations => {
                if (simulations.length == 0) {
                    this.error = 'Não há formas de pagamentos definidas';
                    return;
                }
                this.payments = simulations;

                this.payments.forEach(payment => {
                    if (!this.isPagseguro(payment)) {
                        let installmentLimit: PaymentSetting = payment.settings.find(s => s.name.toLowerCase() == 'installmentlimit');
                        if (installmentLimit) {
                            payment.paymentMethods[0].installment = payment.paymentMethods[0].installment.slice(0, Number.parseInt(installmentLimit.value));
                        }
                    }
                });

                this.selectGateway(this.defaultPayment(this.payments));             
            })
            .catch(error => {
                console.log(error);
                this.error = `Não foi possível obter o parcelamento (Erro: ${error.status})`;
                this.payments = [];
            });
    }

    hasSimulation(): boolean {
        return this.manager.hasMundipaggCreditCard(this.payments);
    }

    nonEmptyMethod(): PaymentMethod[] {
        return this.simulation.paymentMethods.filter(m => m.installment.length > 0);
    }

    getMaxInstallment(gateway: Payment): string {
        let method = (gateway.paymentMethods.length > 0) ? gateway.paymentMethods[0] : new PaymentMethod({ installment: [] });
        let maxInstallment: number = 0;

        if (this.isMundiPagg(gateway))
            maxInstallment = method.installment[method.installment.length - 1].number;
        else if (this.isMercadoPago(gateway))
            maxInstallment = method.installment.length;

        else if (this.isPagseguro(gateway))
            maxInstallment = method.installment[method.installment.length - 1].number;

        return `Pague em até ${maxInstallment}x no cartão de crédito pagando com ${gateway.name}`;
    }

    selectGateway(gateway: Payment) {
        this.gatewaySelected = gateway;
    }

    isSelected(gateway: Payment): boolean {
        if (this.gatewaySelected && this.gatewaySelected.id == gateway.id)
            return true;
        else
            return false;
    }

    defaultPayment(payments: Payment[]): Payment {
        return payments.find(p => p.default == true);
    }

    getInstallments(payment: Payment): Installment[] {
        if (payment.paymentMethods.length > 0)
            return payment.paymentMethods[0].installment;
        else return []
    }

    isMundiPagg(gateway: Payment): boolean {
        if (this.manager.isMundiPagg(gateway))
            return true;
        else return false;
    }

    isMercadoPago(gateway: Payment): boolean {
        return this.manager.isMercadoPago(gateway, this.payments);
    }

    isPagseguro(gateway: Payment): boolean {
        return this.manager.isPagSeguro(gateway, this.payments);
    }

}