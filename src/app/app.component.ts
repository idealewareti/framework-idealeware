import { Component, OnInit, Inject, PLATFORM_ID, AfterViewInit } from '@angular/core';
import { Meta, Title, SafeResourceUrl, DomSanitizer, TransferState, makeStateKey } from '@angular/platform-browser';
import { Globals } from './models/globals';
import { Store } from './models/store/store';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Cart } from './models/cart/cart';
import { Institutional } from './models/institutional/institutional';
import { AppCore } from './app.core';
import { InstitutionalService } from './services/institutional.service';
import { isPlatformBrowser } from '@angular/common';
import { PaymentService } from './services/payment.service';
import { Payment } from './models/payment/payment';
import { Google } from './models/google/google';
import { Customer } from './models/customer/customer';
import { EnumStoreModality } from './enums/store-modality.enum';
import { AppConfig } from './app.config';
import { PaymentManager } from './managers/payment.manager';
import { PaymentMethod } from './models/payment/payment-method';
import { GoogleService } from './services/google.service';
import { CustomerManager } from './managers/customer.manager';
import { Token } from './models/customer/token';
import { ScriptService } from './services/script.service';
import { StoreManager } from './managers/store.manager';

const PAYMENTS_KEY = makeStateKey('payments_key');
const INSTITUTIONALS_KEY = makeStateKey('institutionals_key');

declare var $: any;
declare var ga: any;

@Component({
    selector: 'app-root',
    templateUrl: './template/app.html',
    styleUrls: [],
    providers: [ScriptService]
})
export class AppComponent implements OnInit, AfterViewInit {

    /*
    Members
    *********************************************************************************************************
    */
    private path: string;
    private logged: boolean;
    private ssl: boolean = false;
    private PagseguroScriptAdded: boolean = false;
    private MercadopagoScriptAdded: boolean = false;
    cart: Cart;
    date: Date = new Date();
    googleUA: Google;
    customer: Customer;
    mediaPath: string;
    logoPath: string;
    logoMobilePath: string;
    institutionals: Institutional[] = [];
    payments: Payment[] = [];
    zipCode: string;
    messageZipCode: string;
    q: string;
    facebookSafeUrl: SafeResourceUrl;
    store: Store;

    /*
    Readonly
    *********************************************************************************************************
    */
    private readonly storeStaticPath: string = '/store/';

    /*
    Constructor
    *********************************************************************************************************
    */
    constructor(
        private route: ActivatedRoute,
        private title: Title,
        private meta: Meta,
        private globals: Globals,
        private router: Router,
        private sanitizer: DomSanitizer,
        private storeManager: StoreManager,
        private institutionalService: InstitutionalService,
        private paymentService: PaymentService,
        private paymentManager: PaymentManager,
        private googleService: GoogleService,
        private customerManager: CustomerManager,
        private state: TransferState,
        private scriptService: ScriptService,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {
        this.globals = new Globals();
        this.globals.store = new Store();
        this.globals.cart = new Cart();
        this.store = new Store();
    }

    /*
    Lifecycle
    *********************************************************************************************************
    */
    ngOnInit(): Promise<any> {
        if (!this.getSessionId()) {
            this.setSessionId();
        }
        return this.storeManager.getStore()
            .then(store => {
                this.globals.store = store;
                this.store = store;
                this.initImagePath(store);
                this.getInstitutionals();
                this.getGoogle();
                if (this.store.modality == EnumStoreModality.Ecommerce) {
                    this.getPayments();
                }
                this.facebookSafeUrl = this.getFacebookUrl();
            })
            .catch(error => {
                console.log(error);
                this.router.navigate(['/erro-500']);
            });
    }

    ngAfterContentChecked() {
        this.getCustomer();
    }

    ngAfterViewChecked() {
        this.keepHttps();
        this.checkSessionId();
        this.addPagseguro();
        this.addMercadoPago();
        if (this.store && !this.ssl) {
            this.ssl = this.addSSL();
        }

    }

    ngAfterViewInit(): void {
        if (isPlatformBrowser(this.platformId)) {
            this.getUrl();
            this.scriptService.loadScript('https://seal.alphassl.com/SiteSeal/alpha_image_115-55_en.js');
            if (this.isMobile()) {
                const bodySelector = $('body');
                if (!bodySelector.hasClass('mobile-body'))
                    bodySelector.addClass('mobile-body').removeClass('desktop-body');
            } else {
                $('body').removeClass('mobile-body').addClass('desktop-body');
            }

            if (isPlatformBrowser(this.platformId)) {
                $('#btn-search').click(function (event) {
                    $('#search-box .mask').hide();
                    $('#search-box #form-search').css('top', '-100%');
                    $('#search-box').show();
                    $('#search-box .mask').fadeIn(300);
                    $('#search-box #form-search').css('top', 0);
                    return false;
                });
                $('#search-box .btn-close,#search-box .mask').click(function (event) {
                    $('#search-box #form-search').css('top', '-100%');
                    $('#search-box .mask').fadeOut(300, function () {
                        $('#search-box').hide();
                    });

                    return false;
                });
            }
        }
    }

    /*
    Getters
    *********************************************************************************************************
    */
    /**
     * Retorna a loja
     * @returns {Store} 
     * @memberof AppComponent
     */
    getStore(): Store {
        return this.store;
    }

    /**
     * Retorna os dados do cliente
     * @memberof AppComponent
     */
    getCustomer() {
        if (this.customerManager.hasToken() && !this.customer) {
            this.customerManager.getUserFromStorage()
                .then(user => {
                    this.customer = user;
                    this.logged = true;
                })
                .catch(() => {
                    this.customer = null;
                    this.logged = false;
                });
        }
        else if (!this.customerManager.hasToken()) {
            this.customer = null;
            this.logged = false;
        }
    }

    /**
     * Retorna as páginas institucionais
     * @returns 
     * @memberof AppComponent
     */
    getInstitutionals() {
        this.institutionals = this.state.get(INSTITUTIONALS_KEY, null as any);
        if (this.institutionals) return;

        this.institutionalService.getAll()
            .subscribe(response => {
                this.state.set(INSTITUTIONALS_KEY, response as any);
                this.institutionals = response
            }, error => {
                console.log(error.text());
            });
    }

    /**
     * Retorna a URLs da página institucional
     * @param {Institutional} page 
     * @returns {string} 
     * @memberof AppComponent
     */
    getInstitutionalUrl(page: Institutional): string {
        if (page.allowDelete)
            return `/institucional/${page.id}/${AppCore.getNiceName(page.title)}`;
        else
            return '/contato';
    }

    /**
     * Retorna os pagamentos da loja
     * @returns {Promise<Payment[]>} 
     * @memberof AppComponent
     */
    getPayments(): Promise<Payment[]> {
        return new Promise((resolve, reject) => {
            this.payments = this.state.get(PAYMENTS_KEY, [] as any);
            if (this.payments.length > 0) {
                this.createPagseguroSession();
                resolve(this.payments);
            } else {
                this.paymentService.getAll()
                    .subscribe(payments => {
                        this.state.set(PAYMENTS_KEY, payments as any);
                        this.payments = payments;
                        this.createPagseguroSession();
                        resolve(payments);
                    }, error => {
                        console.log(error._body);
                        reject(error);
                    });
            }
        });
    }

    /*
    Private Methods
    *********************************************************************************************************
    */
    private initImagePath(store: Store): void {
        this.mediaPath = `${store.link}/static`;
        this.logoPath = this.mediaPath + this.storeStaticPath + store.logo;
        this.logoMobilePath = this.mediaPath + this.storeStaticPath + store.logoMobile;
    }

    /**
     * Retorna a URL da rota
     * @private
     * @memberof AppComponent
     */
    private getUrl() {
        this.router.events.subscribe((url: any) => {
            this.path = url['url'];
            if (this.path && !this.path.includes('q=')) {
                this.q = '';
            }
        });
    }

    /*
    Validators
    *********************************************************************************************************
    */
    /**
     * Valida se a página atual é checkout
     * @returns {boolean} 
     * @memberof AppComponent
     */
    isCheckout(): boolean {
        if (!this.path) {
            return false;
        }
        else if (this.path.split('/')[1] == 'checkout') {
            return true;
        }
        else if (this.path.split('/')[1] == 'orcamento') {
            return true;
        }
        else return false;
    }

    /**
     * Verifica se o acesso é mobile
     * @returns {boolean} 
     * @memberof AppComponent
     */
    isMobile(): boolean {
        if (isPlatformBrowser(this.platformId)) {
            return AppCore.isMobile(window);
        }
        else return false;
    }

    /**
     * Valida se o cliente está logado
     * @returns {boolean} 
     * @memberof AppComponent
     */
    isLoggedIn(): boolean {
        return this.logged;
    }

    /*
    Actions
    *********************************************************************************************************
    */
    /**
     * Abre o box de busca no mobile
     * @param {any} event 
     * @memberof AppComponent
     */
    searchFor(event) {
        if (isPlatformBrowser(this.platformId)) {
            event.preventDefault();
            $('#search-box #form-search').css('top', '-100%');
            $('#search-box .mask').fadeOut(300, function () {
                $('#search-box').hide();
            });
            this.router.navigate(['/buscar', { 'q': this.q }]);
        }
    }

    /**
     * Cria uma nova sessão na loja
     * @memberof AppComponent
     */
    setSessionId() {
        if (isPlatformBrowser(this.platformId)) {
            let guid = AppCore.createGuid();
            localStorage.setItem('session_id', guid);
        }
    }

    /**
     * Verifica se a loja possui uma sessão criada
     * Caso não possua, uma nova será gerada
     * @memberof AppComponent
     */
    checkSessionId() {
        if (!this.getSessionId()) {
            this.setSessionId();
        }
    }

    /**
     * Retorna a sessão criada
     * @returns {string} 
     * @memberof AppComponent
     */
    getSessionId(): string {
        if (isPlatformBrowser(this.platformId)) {
            return localStorage.getItem('session_id');
        }
        return null;
    }

    /**
     * Retorna o ID da página do Facebook da loja
     * @returns {string} 
     * @memberof AppComponent
     */
    getFacebook(): string {
        return AppConfig.FACEBOOK_PAGE;
    }

    /**
     * Retorna a url do Facebook 
     * @returns {SafeResourceUrl} 
     * @memberof AppComponent
     */
    getFacebookUrl(): SafeResourceUrl {
        let url = `https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2F${this.getFacebook()}%2F&tabs&width=340&height=214&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId=214403341930049`;
        return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }

    /**
     * Adiciona o script do Mercado Pago na loja
     * @memberof AppComponent
     */
    addMercadoPago() {
        if (isPlatformBrowser(this.platformId)) {
            if (this.store && !this.MercadopagoScriptAdded && this.store.modality == EnumStoreModality.Ecommerce && this.hasMercadoPago()) {
                this.MercadopagoScriptAdded = true;
                let s = document.createElement('script');
                s.type = 'text/javascript';
                s.src = 'https://secure.mlstatic.com/sdk/javascript/v1/mercadopago.js';
                $('body').append(s);
            }
        }
    }

    /**
     * Adiciona o script do pagseguro na loja
     * @memberof AppComponent
     */
    addPagseguro() {
        if (isPlatformBrowser(this.platformId)) {
            if (this.store && !this.PagseguroScriptAdded && this.globals.store.modality == EnumStoreModality.Ecommerce && this.hasPagSeguro()) {
                this.PagseguroScriptAdded = true;
                var s = document.createElement('script');
                s.type = 'text/javascript';
                s.src = (this.getPagSeguro().isSandBox) ? 'https://stc.sandbox.pagseguro.uol.com.br/pagseguro/api/v2/checkout/pagseguro.directpayment.js' : 'https://stc.pagseguro.uol.com.br/pagseguro/api/v2/checkout/pagseguro.directpayment.js';
                $('body').append(s);
            }
        }
    }

    /**
     * Verifica se a loja possui Mercado Pago
     * @returns {boolean} 
     * @memberof AppComponent
     */
    hasMercadoPago(): boolean {
        return this.paymentManager.hasMercadoPago(this.payments);
    }

    /**
     * Retorna o meio de pagamento Mercado Pago
     * @returns {Payment} 
     * @memberof AppComponent
     */
    getMercadoPago(): Payment {
        return this.paymentManager.getMercadoPago(this.payments);
    }

    /**
     * Verifica se a loja possui Mundipagg
     * @returns {boolean} 
     * @memberof AppComponent
     */
    hasMundipagg(): boolean {
        return this.paymentManager.hasMundipagg(this.payments);
    }

    /**
     * Retorna as bandeiras do cartão de crédito do gateway Mundipagg
     * @returns 
     * @memberof AppComponent
     */
    getMundipaggBrands() {
        if (this.paymentManager.hasMundipagg(this.payments)) {
            let bankslip: Payment = this.paymentManager.getMundipaggBankslip(this.payments);
            let creditCard: Payment = this.paymentManager.getMundipaggCreditCard(this.payments);
            let methods: PaymentMethod[] = [];
            return methods.concat((bankslip) ? bankslip.paymentMethods : [], (creditCard) ? creditCard.paymentMethods : []);
        }
        else return [];
    }

    /**
     * Verifica se a loja possui pagseguro
     * @returns {boolean} 
     * @memberof AppComponent
     */
    hasPagSeguro(): boolean {
        return this.paymentManager.hasPagSeguro(this.payments);
    }

    /**
     * Retorna o Pagseguro da loja
     * @returns {Payment} 
     * @memberof AppComponent
     */
    getPagSeguro(): Payment {
        return this.paymentManager.getPagSeguro(this.payments);
    }

    /**
     * Adiciona o UA-Code do Google Analytics no site
     * @memberof AppComponent
     */
    getGoogle() {
        if (isPlatformBrowser(this.platformId)) {
            this.googleService.getAll()
                .subscribe(response => {
                    // Se houver UA Code cadastrado, prosseguir
                    if (response) {
                        this.googleUA = response;
                        // Cria o primeiro pageview na loja
                        ga('create', response.uaCode, 'auto');
                        ga('send', 'pageview');
                        // Adiciona um evento ao mudar a rota para que o Analy
                        this.router.events.subscribe(event => {
                            if (event instanceof NavigationEnd) {
                                ga('set', 'page', event.urlAfterRedirects);
                                ga('send', 'pageview');
                            }
                        });
                    }
                }, e => console.log(e));
        }
    }

    /**
     * Move o selo SSL para dentro do footer
     * @returns {boolean} 
     * @memberof AppComponent
     */
    addSSL(): boolean {
        if (isPlatformBrowser(this.platformId)) {
            let children = $('#index-seal-ssl').children();
            if (children.length == 4) {
                for (let i = 0; i < children.length; i++) {
                    let c = children[i];
                    $('#selo-alphassl').append(c);
                }
                return true;
            }
            else {
                return false;
            }
        }
        return false;
    }

    /**
    * Mantém o site sempre em https
    * (exceto quando ele estiver rodando em localhost)
    * @memberof AppComponent
    */
   keepHttps() {
        if (isPlatformBrowser(this.platformId)) {
            if (location.href.indexOf("https://") == -1 && location.hostname != 'localhost' && !/^\d+[.]/.test(location.hostname)) {
                location.href = location.href.replace("http://", "https://");
            }
        }
    }

    /**
     * Cria a sessão no pagseguro e armazena no Local Storage
     * @memberof AppComponent
     */
    createPagseguroSession() {
        if (isPlatformBrowser(this.platformId)) {
            if (this.customerManager.hasToken()) {
                let token: Token = this.customerManager.getToken();
                this.paymentService.createPagSeguroSession(token)
                    .then(sessionId => {
                        localStorage.setItem('pagseguro_session', sessionId);
                    })
                    .catch(error => {
                        console.log(`ERRO AO GERAR A SESSÃO DO PAGSEGURO: ${error}`);
                    });
            }
            else {
                this.paymentManager.createPagSeguroSessionSimulator()
                    .then(sessionId => {
                        localStorage.setItem('pagseguro_session', sessionId);
                    })
                    .catch(error => {
                        console.log(`ERRO AO GERAR A SESSÃO DO PAGSEGURO: ${error}`);
                    });
            }
        }
    }
}
