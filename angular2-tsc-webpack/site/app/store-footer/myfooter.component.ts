import { Component, Input, OnInit, AfterViewChecked } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Institutional } from '../_models/institutional/institutional';
import { InstitutionalService } from '../_services/institutional.service';
import { Store } from '../_models/store/store';
import { PaymentService } from "../_services/payment.service";
import { Payment } from "../_models/payment/payment";
import { PaymentMethod } from "../_models/payment/payment-method";
import { AppSettings } from "../app.settings";

//declare var $: any;

@Component({
    moduleId: module.id,
    selector: 'store-footer',
    templateUrl: '/views/myfooter.component.html'
})
export class MyFooterComponent implements OnInit {
    date: Date = new Date();
    private path: string;
    @Input() store: Store;
    institutionals: Institutional[] = [];
    payment: Payment;
    paymentName: string;
    methods: PaymentMethod[] = [];
    mediapath: string = AppSettings.MEDIA_PATH;
    zipCode: string;
    messageZipCode: string;

    constructor(
        private route: ActivatedRoute,
        private parentRouter: Router,
        private location: Location,
        private service: InstitutionalService,
        private paymentService: PaymentService,

    ) {
    }

    ngOnInit() {
        this.path = this.parentRouter.url;
        this.getUrl();
        this.getInstitutionals();
        this.getFlagPayments();
        this.showZipcodePopup()
    }

    ngAfterViewChecked() {
        this.getUrl();
    }

    private getUrl() {
        this.parentRouter.events.subscribe((url: any) => {
            this.path = url['url']
        });
    }

    public isCheckout(): boolean {
        if (!this.path) return false
        else if (this.path.split('/')[1] == 'checkout') return true;
        else if (this.path.split('/')[1] == 'orcamento') return true;
        else return false;
    }

    getInstitutionals() {
        this.service.getAll()
            .then(response => this.institutionals = response)
            .catch(error => console.log(error._body));
    }
 

    getFlagPayments() {
        this.paymentService.getAll()
            .then(response => {
                this.payment = response.filter(p => p.type == 1)[0];
                this.paymentName = this.payment.name.toLowerCase();
                this.payment.paymentMethods.forEach(n => {
                    this.methods.push(n);
                });
            })
            .catch(error => console.log(error._body));
    }

    showZipcodePopup(){
        this.checkZipcode();

        setInterval(() => {
            this.checkZipcode();
        }, 5000);
    }

    checkZipcode() {
        this.store.settings.forEach(element => {
            if (element.type == 2 && element.status == true) {
                if (!localStorage.getItem('customer_zipcode')) {
                    $('#zipcodeModal').fadeIn(function () {
                        $(document).on('click', '#login .mask, #login .btn-close-clickview', function () {
                            $('#zipcodeModal').fadeOut();
                        });
                    });
                }
                else {
                    $('#zipcodeModal').fadeOut();
                }
            }
        });
    }

    setZipCode(event) {
        event.preventDefault();
        if (/\d{5}-\d{3}/.test(this.zipCode)) {
            localStorage.setItem('customer_zipcode', this.zipCode);
            $('#zipcodeModal').fadeOut();
            this.messageZipCode = null;
        }
        else {
            this.messageZipCode = "O CEP deve conter 8 caracteres";
        }
    }

    isMobile(): boolean{
        return AppSettings.isMobile();
    }
}