import {
    Component, OnInit, Inject, PLATFORM_ID,
    AfterViewInit, ElementRef, Renderer2, ViewChild
} from '@angular/core';
import {
    Meta, Title, SafeResourceUrl, DomSanitizer,
    TransferState, makeStateKey
} from '@angular/platform-browser';
import { Globals } from './models/globals';
import { Store } from './models/store/store';
import { Router, NavigationEnd, ActivatedRoute, ActivationEnd, ActivationStart, ResolveStart } from '@angular/router';
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
import { KondutoManager } from './managers/konduto.manager';

const PAYMENTS_KEY = makeStateKey('payments_key');
const INSTITUTIONALS_KEY = makeStateKey('institutionals_key');

declare var $: any;
declare var gtag: any;

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
    @ViewChild('konduto') kondutoContainer: ElementRef;
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
        private renderer: Renderer2,
        private kondutoManager: KondutoManager,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {
        // Antifraude precisa ser o primeiro a carregar para que as metas já venham contempladas
        if (this.isKondutoActived()) {
            this.kondutoManager.addOrUpdatePageMeta('Home');
            this.router.events.subscribe((url: any) => {
                if (url instanceof ActivationStart) {
                    const routeName = url.snapshot.data.name || '';
                    this.kondutoManager.addOrUpdatePageMeta(routeName);
                }
            });
        }

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

                if (this.isKondutoActived()) {
                    this.injectKondutoScript(this.store.kondutoPublicKey);
                }

                this.getGoogle();
                if (this.store.modality == EnumStoreModality.Ecommerce) {
                    this.getPayments();
                }
                this.facebookSafeUrl = this.getFacebookUrl();
            })
            .catch(error => {
                console.log('init err:');
                console.log(error);
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
    }

    ngAfterViewInit(): void {
        if (isPlatformBrowser(this.platformId)) {
            this.checkRouter();
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
        if (isPlatformBrowser(this.platformId)) {
            this.institutionalService.getAll()
                .subscribe(response => {
                    this.institutionals = response
                }, error => {
                    console.log(error.text());
                });
        }
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
     * verificar rotas
     * @private
     * @memberof AppComponent
     */
    private checkRouter() {
        this.router.events.subscribe((url: any) => {
            this.path = url['url'];
            if (this.path && !this.path.includes('q=')) {
                this.q = '';
            }
        });

        /*Capturar mudanças na rotas para da um scroll para topo */
        let self = this;
        this.router.events.subscribe((evt) => {
            if (!(evt instanceof NavigationEnd)) {
                return;
            }
            window.scrollTo(0, 0)

        });
    }

    private injectKondutoScript(key: string): void {
        if (!key) return;
        const scriptLoaded = document.getElementById('kdtjs');

        if (scriptLoaded) {
            return;
        }
        let script = this.renderer.createElement('script');
        const content = `
            var __kdt = __kdt || [];
            __kdt.push({"public_key": "${key}"});   
                (function() {   
                    var kdt = document.createElement('script');   
                    kdt.id = 'kdtjs'; kdt.type = 'text/javascript';   
                    kdt.async = true;    
                    kdt.src = 'https://i.k-analytix.com/k.js';   
                    var s = document.getElementsByTagName('body')[0];   
                    s.parentNode.insertBefore(kdt, s);   
                })(); 
        `
        script.innerHTML = content;
        this.renderer.appendChild(this.kondutoContainer.nativeElement, script);
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
     * Indica se a loja utiliza a Konduto
     * @returns {boolean} 
     * @memberof AppComponent
     */
    isKondutoActived(): boolean {
        return AppConfig.KONDUTO;
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
                        gtag('config', response.uaCode);
                        gtag('config', response.uaCode, {
                            'page_title': 'home',
                            'page_path': '/'
                        });
                        gtag('event', 'page_view', { 'send_to': response.uaCode });
                        // Adiciona um evento ao mudar a rota para que o Analy
                        this.router.events.subscribe(event => {
                            if (event instanceof NavigationEnd) {
                                gtag('config', response.uaCode);
                                gtag('config', response.uaCode, {
                                    'page_path': event.urlAfterRedirects
                                });
                                gtag('event', 'page_view', { 'send_to': response.uaCode });
                            }
                        });
                    }
                }, e => console.log(e));
        }
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
        if (!this.hasPagSeguro()) {
            return;
        }

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
