import { Component, OnInit, AfterContentChecked, AfterViewChecked, AfterViewInit } from '@angular/core';
import { Http } from '@angular/http';
import { AppSettings } from './app.settings';
import {
    Router,
    Event as RouterEvent,
    NavigationStart,
    NavigationEnd,
    NavigationCancel,
    NavigationError
} from '@angular/router'
import { NgProgressService } from 'ngx-progressbar';
import { StoreService } from './services/store.service';
import { CartManager } from "./managers/cart.manager";
import { Cart } from "./models/cart/cart";
import { Store } from "./models/store/store";
import { GoogleService } from "./services/google.service";
import { Google } from "./models/google/google";
import { CustomerService } from "./services/customer.service";
import { Customer } from "./models/customer/customer";
import { InstitutionalService } from "./services/institutional.service";
import { PaymentService } from "./services/payment.service";
import { Institutional } from "./models/institutional/institutional";
import { Payment } from "./models/payment/payment";
import { PaymentMethod } from "./models/payment/payment-method";
import { EnumStoreModality } from "./enums/store-modality.enum";
import { PaymentManager } from "./managers/payment.manager";
import { Globals } from "app/models/globals";
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

declare var S: any;
declare var ga: any;
declare var $: any;

@Component({
    moduleId: module.id,
    selector: 'app',
    templateUrl: './views/app.component.html'
})
export class AppComponent implements OnInit {
    cart: Cart;
    date: Date = new Date();
    googleUA: Google;
    customer: Customer;
    private path: string;
    private logged: boolean;
    private ssl: boolean = false;
    private PagseguroScriptAdded: boolean = false;
    private MercadopagoScriptAdded: boolean = false;
    mediaPath: string;
    institutionals: Institutional[] = [];
    payments: Payment[] = [];
    zipCode: string;
    messageZipCode: string;
    q: string;
    facebookSafeUrl: SafeResourceUrl;

    constructor(
        private loaderService: NgProgressService,
        private router: Router,
        private service: StoreService,
        private customerService: CustomerService,
        private institutionalService: InstitutionalService,
        private paymentService: PaymentService,
        private paymentManager: PaymentManager,
        private googleService: GoogleService,
        private cartManager: CartManager,
        private globals: Globals,
        private sanitizer: DomSanitizer,
    ) {

        if (!this.getSessionId())
            this.setSessionId();

        this.loaderService.start();
        this.service.setUp();
    }

    ngOnInit() {
        this.service.getInfo()
            .then(store => {
                this.globals.store = store;
                this.getInstitutionals();
                this.getGoogle();
                this.showZipcodePopup();
                this.mediaPath = `${store.link}/static/store`

                if(this.globals.store.modality == EnumStoreModality.Ecommerce)
                    this.getPayments();
                
                this.facebookSafeUrl = this.getFacebookUrl();
            })
            .catch(error => console.log(error));

    }

    ngAfterViewInit() {}

    ngAfterContentChecked() {
        this.getUrl();
        this.getCustomer();
        if (this.globals.store && !this.ssl) {
            this.ssl = this.addSSL();
        }

        $('#btn-search').click(function(event) {
			$('#search-box .mask').hide();
			$('#search-box #form-search').css('top', '-100%');
			$('#search-box').show();
			$('#search-box .mask').fadeIn(300);
			$('#search-box #form-search').css('top', 0);
			return false;
		});
		$('#search-box .btn-close,#search-box .mask').click(function(event) {
			$('#search-box #form-search').css('top', '-100%');
			$('#search-box .mask').fadeOut(300, function(){
				$('#search-box').hide();
			});
			
			return false;
		})
    }

    ngAfterViewChecked() {
        this.checkSessionId();
        this.getUrl();
        this.addPagseguro();
        this.addMercadoPago();

        if (this.isMobile()) {
            if (!$('body').hasClass('mobile-body'))
                $('body').addClass('mobile-body').removeClass('desktop-body');
        }
        else {
            $('body').removeClass('mobile-body').addClass('desktop-body');
        }
    }

    setSessionId() {
        let guid = AppSettings.createGuid();
        localStorage.setItem('session_id', guid);
    }

    checkSessionId() {
        if (!this.getSessionId())
            this.setSessionId();
    }

    getSessionId(): string {
        return localStorage.getItem('session_id');
    }

    getGoogle() {
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

    private getUrl() {
        this.router.events.subscribe((url: any) => this.path = url['url']);
    }

    isLoggedIn() {
        return this.logged;
    }

    isCheckout(): boolean {
        if (!this.path) return false
        else if (this.path.split('/')[1] == 'checkout') return true;
        else if (this.path.split('/')[1] == 'orcamento') return true;
        else return false;
    }

    isMobile(): boolean {
        return AppSettings.isMobile();
    }

    private getCustomer() {
        if (this.customerService.hasToken() && !this.customer) {
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
        else if (!this.customerService.hasToken()) {
            this.customer = null;
            this.logged = false;
        }
    }

    getInstitutionals() {
        this.institutionalService.getAll()
            .then(response => this.institutionals = response)
            .catch(error => console.log(error.text()));
    }
        
    getInstitutionalUrl(page: Institutional): string{
        if(page.allowDelete)
            return `/institucional/${page.id}/${page.niceName}`;
        else
            return '/contato';
    }

    getPayments(): Promise<Payment[]>{
        return new Promise((resolve, reject) => {
            this.paymentService.getAll()
            .then(payments => {
                this.payments = payments;
                resolve(payments);
            })

            .catch(error => {
                console.log(error._body);
                reject(error);
            });
        });
    }

    showZipcodePopup() {
        this.checkZipcode();
        setInterval(() => {
            this.checkZipcode();
        }, 5000);
    }

    checkZipcode() {
        this.globals.store.settings.forEach(element => {
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

    addSSL(): boolean {
        var s = document.createElement('script');
        s.type = 'text/javascript';
        s.src = '//seal.alphassl.com/SiteSeal/alpha_image_115-55_en.js';
        $('body').append(s);
        return true;
    }

    /**
     * Adiciona o script do pagseguro quando estiver na tela de checkout
     * 
     * 
     * @memberof AppComponent
     */

    addPagseguro(){
        if(this.globals.store
            && !this.PagseguroScriptAdded 
            && this.globals.store.modality == EnumStoreModality.Ecommerce
            && this.hasPagSeguro()
        ){
            this.PagseguroScriptAdded = true;
            var s = document.createElement('script');
            s.type = 'text/javascript';
            s.src = (this.getPagSeguro().isSandBox) ? 'https://stc.sandbox.pagseguro.uol.com.br/pagseguro/api/v2/checkout/pagseguro.directpayment.js' : 'https://stc.pagseguro.uol.com.br/pagseguro/api/v2/checkout/pagseguro.directpayment.js';
            $('body').append(s);
        }
    }

    searchFor(event){
        event.preventDefault();
        $('#search-box #form-search').css('top', '-100%');
        $('#search-box .mask').fadeOut(300, function(){
            $('#search-box').hide();
        });
        this.router.navigate(['/buscar', {'q': this.q}]);
    }
    
    /**
  * Adiciona o script do mercadopago quando estiver na tela de checkout
  * 
  * 
  * @memberof AppComponent
  */
    addMercadoPago() {
        if(this.globals.store
            && !this.MercadopagoScriptAdded 
            && this.globals.store.modality == EnumStoreModality.Ecommerce
            && this.hasMercadoPago()
        ){
            this.MercadopagoScriptAdded = true;
            let s = document.createElement('script');
            s.type = 'text/javascript';
            s.src = 'https://secure.mlstatic.com/sdk/javascript/v1/mercadopago.js';
            $('head').append(s);
        }
    }

    hasMercadoPago(): boolean{
        return this.paymentManager.hasMercadoPago(this.payments);
    }

    getMercadoPago(): Payment{
        return this.paymentManager.getMercadoPago(this.payments);
    }

    hasMundipagg(): boolean{
        return this.paymentManager.hasMundipagg(this.payments);
    }

    getMundipaggBrands(){
        if(this.paymentManager.hasMundipagg(this.payments)){
            let bankslip: Payment = this.paymentManager.getMundipaggBankslip(this.payments);
            let creditCard: Payment = this.paymentManager.getMundipaggCreditCard(this.payments);
    
            let methods: PaymentMethod[] = [];
            return methods.concat((bankslip) ? bankslip.paymentMethods: [], (creditCard) ? creditCard.paymentMethods : []);
        }
        else return [];
    }

    hasPagSeguro(): boolean{
        return this.paymentManager.hasPagSeguro(this.payments);
    }

    getPagSeguro(): Payment{
        return this.paymentManager.getPagSeguro(this.payments);
    }

    getStore(): Store{
        return this.globals.store;
    }

    getFacebook(): string{
        return AppSettings.FACEBOOK_PAGE;
    }

    getFacebookUrl(): SafeResourceUrl {
        let url = `https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2F${this.getFacebook()}%2F&tabs&width=340&height=214&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId=214403341930049`;
        return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }

    getLoaderColor(): string{
        return AppSettings.LOADER_COLOR;
    }

}