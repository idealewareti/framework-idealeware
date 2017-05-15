import {Component, OnInit, AfterContentChecked, AfterViewChecked, AfterViewInit} from '@angular/core';
import {Http} from '@angular/http';
import {AppSettings} from './app.settings';
import {
    Router,
    Event as RouterEvent,
    NavigationStart,
    NavigationEnd,
    NavigationCancel,
    NavigationError
} from '@angular/router'
import {NgProgressService} from 'ngx-progressbar';
import {StoreService} from './_services/store.service';
import { CartManager } from "./_managers/cart.manager";
import { Cart } from "./_models/cart/cart";
import { Store } from "./_models/store/store";
import { GoogleService } from "./_services/google.service";
import { Google } from "./_models/google/google";
import { CustomerService } from "./_services/customer.service";
import { Customer } from "./_models/customer/customer";
import { InstitutionalService } from "./_services/institutional.service";
import { PaymentService } from "./_services/payment.service";
import { Institutional } from "./_models/institutional/institutional";
import { Payment } from "./_models/payment/payment";
import { PaymentMethod } from "./_models/payment/payment-method";

declare var S: any;
declare var ga: any;
//declare var $: any;

@Component({
    moduleId: module.id,
    selector: 'app',
    templateUrl: '/views/app.component.html'
})
export class AppComponent implements OnInit {
    cart: Cart;
    date: Date = new Date();
    store: Store;
    googleUA: Google;
    customer: Customer;
    private path: string;
    private logged: boolean;
    private ssl: boolean = false;
    public readonly mediaPath = `${AppSettings.MEDIA_PATH}/store`;
    institutionals: Institutional[] = [];
    payment: Payment;
    paymentName: string;
    methods: PaymentMethod[] = [];
    zipCode: string;
    messageZipCode: string;

    constructor(
        private loaderService: NgProgressService,
        private router: Router,
        private service: StoreService,
        private customerService: CustomerService,
        private institutionalService: InstitutionalService,
        private paymentService: PaymentService,
        private googleService: GoogleService,
        private cartManager: CartManager,
    ) {
        
        if(!this.getSessionId())
            this.setSessionId();
        
        this.loaderService.start();
        this.service.setUp();
    }

    ngOnInit() {
        this.service.getInfo()
            .then(store => {
                this.store = store;
                this.getInstitutionals();
                this.getGoogle();
                this.getBrandsPayments();
                this.showZipcodePopup();
            })
            .catch(error => console.log(error));
        
    }

    ngAfterViewInit() {
        
    }

    ngAfterContentChecked() {
        this.getUrl();
        this.getCustomer();
        if(this.store && !this.ssl){
            this.ssl = this.addSSL();
        }
    }

    ngAfterViewChecked() {
        this.checkSessionId();
        this.getUrl();

        if(this.isMobile()){
            if(!$('body').hasClass('mobile-body'))
                $('body').addClass('mobile-body').removeClass('desktop-body');
        }
        else{
            $('body').removeClass('mobile-body').addClass('desktop-body');
        }
    }

    setSessionId(){
        let guid = AppSettings.createGuid();
        localStorage.setItem('session_id', guid);
    }

    checkSessionId(){
        if(!this.getSessionId())
            this.setSessionId();
    }

    getSessionId(): string{
        return localStorage.getItem('session_id');
    }

    getGoogle(){
        this.googleService.getAll()
        .then(response => {
            this.googleUA = response;
            ga('create', response.uaCode, 'auto');

            this.router.events.subscribe(event => {
                if (event instanceof NavigationEnd) {
                    ga('set', 'page', event.urlAfterRedirects);
                    ga('send', 'pageview');
                }
            });
        })
        .catch(e => console.log(e));
    }

    private getUrl(){
        this.router.events.subscribe((url:any) => this.path = url['url']);
    }

    public isLoggedIn(){
        return this.logged;
    }

    public isCheckout() : boolean{
        if(!this.path) return false
        else if(this.path.split('/')[1] == 'checkout') return true;
        else if(this.path.split('/')[1] == 'orcamento') return true;
        else return false;
    }

    public isMobile(): boolean{
        return AppSettings.isMobile();
    }

    private getCustomer(){
        if(this.customerService.hasToken() && !this.customer){
            this.customerService.getUserFromStorage()
            .then(user => {
                this.customer = user;
                this.logged = true;
            })
            .catch(() => {
                this.customer = null;
                this.logged = false;
            });
        }
        else if(!this.customerService.hasToken()){
            this.customer = null;
            this.logged = false;
        }
    }

    getInstitutionals() {
        this.institutionalService.getAll()
            .then(response => this.institutionals = response)
            .catch(error => console.log(error._body));
    }

    getBrandsPayments() {
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

    addSSL(): boolean{
        var s = document.createElement('script');
        s.type = 'text/javascript';
        s.src = '//seal.alphassl.com/SiteSeal/alpha_image_115-55_en.js';
        $('head').append(s);
        return true;
    }

    addPagseguro(): boolean{
        
    }
}