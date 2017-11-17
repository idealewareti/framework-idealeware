import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { Meta, Title, SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { StoreService } from './services/store.service';
import { Globals } from './models/globals';
import { Store } from './models/store/store';
import { Router, NavigationEnd } from '@angular/router';
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

declare var $: any;
declare var ga: any;

@Component({
  selector: 'app-root',
  templateUrl: './template/app.html',
  styleUrls: []
})
export class AppComponent implements OnInit {

  /*
  Members
  *********************************************************************************************************
  */
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
  store: Store;

  /*
  Constructor
  *********************************************************************************************************
  */
  constructor(
    private title: Title,
    private meta: Meta,
    private globals: Globals,
    private router: Router,
    private sanitizer: DomSanitizer,
    private service: StoreService,
    private institutionalService: InstitutionalService,
    private paymentService: PaymentService,
    private paymentManager: PaymentManager,
    private googleService: GoogleService,
    private customerManager: CustomerManager,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.globals = new Globals();
    this.globals.store = new Store();
    this.globals.cart = new Cart();
  }

  /*
  Lifecycle
  *********************************************************************************************************
  */
  ngOnInit() {
    if (!this.getSessionId()) {
      this.setSessionId();
    }

    this.service.getStore()
      .subscribe(response => {
        let store: Store = new Store(response);
        this.globals.store = store;
        this.store = store;
        this.mediaPath = `${this.globals.store.link}/static`;
        this.getInstitutionals();
        this.getGoogle();

        if (this.store.modality == EnumStoreModality.Ecommerce) {
          this.getPayments();
        }

        this.facebookSafeUrl = this.getFacebookUrl();

      }, error => {
        console.log(error);
      });
  }

  ngAfterContentChecked() {
    this.getUrl();
    this.getCustomer();
    if (this.globals.store && !this.ssl) {
      this.ssl = this.addSSL();
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

  ngAfterViewChecked() {
    this.checkSessionId();
    this.getUrl();
    this.addPagseguro();
    this.addMercadoPago();
    if (this.isMobile()) {
      if (isPlatformBrowser(this.platformId)) {
        if (!$('body').hasClass('mobile-body'))
          $('body').addClass('mobile-body').removeClass('desktop-body');
      }
      else {
        $('body').removeClass('mobile-body').addClass('desktop-body');
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
    if (this.store)
      return this.store;
    else return null;
  }

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

  getInstitutionals() {
    this.institutionalService.getAll()
      .subscribe(response => {
        this.institutionals = response
      }, error => {
        console.log(error.text());
      });
  }

  getInstitutionalUrl(page: Institutional): string {
    if (page.allowDelete)
      return `/institucional/${page.id}/${AppCore.getNiceName(page.title)}`;
    else
      return '/contato';
  }

  getPayments(): Promise<Payment[]> {
    return new Promise((resolve, reject) => {
      this.paymentService.getAll()
        .subscribe(payments => {
          this.payments = payments;
          resolve(payments);
        }, error => {
          console.log(error._body);
          reject(error);
        });
    });
  }

  /**
   * Retorna a URL da rota
   * @private
   * @memberof AppComponent
   */
  private getUrl() {
    this.router.events.subscribe((url: any) => this.path = url['url']);
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
  searchFor(event){
    if (isPlatformBrowser(this.platformId)) {
      event.preventDefault();
      $('#search-box #form-search').css('top', '-100%');
      $('#search-box .mask').fadeOut(300, function(){
          $('#search-box').hide();
      });
      this.router.navigate(['/buscar', {'q': this.q}]);
    }      
  }

  setSessionId() {
    if (isPlatformBrowser(this.platformId)) {
      let guid = AppCore.createGuid();
      localStorage.setItem('session_id', guid);
    }
  }

  checkSessionId() {
    if (!this.getSessionId()) {
      this.setSessionId();
    }
  }

  getSessionId(): string {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('session_id');
    }
    return null;
  }

  getFacebook(): string {
    return AppConfig.FACEBOOK_PAGE;
  }

  getFacebookUrl(): SafeResourceUrl {
    let url = `https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2F${this.getFacebook()}%2F&tabs&width=340&height=214&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId=214403341930049`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  /*
  Actions
  *********************************************************************************************************
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

  hasMercadoPago(): boolean {
    return this.paymentManager.hasMercadoPago(this.payments);
  }

  getMercadoPago(): Payment {
    return this.paymentManager.getMercadoPago(this.payments);
  }

  hasMundipagg(): boolean {
    return this.paymentManager.hasMundipagg(this.payments);
  }

  getMundipaggBrands() {
    if (this.paymentManager.hasMundipagg(this.payments)) {
      let bankslip: Payment = this.paymentManager.getMundipaggBankslip(this.payments);
      let creditCard: Payment = this.paymentManager.getMundipaggCreditCard(this.payments);
      let methods: PaymentMethod[] = [];
      return methods.concat((bankslip) ? bankslip.paymentMethods : [], (creditCard) ? creditCard.paymentMethods : []);
    }
    else return [];
  }

  hasPagSeguro(): boolean {
    return this.paymentManager.hasPagSeguro(this.payments);
  }

  getPagSeguro(): Payment {
    return this.paymentManager.getPagSeguro(this.payments);
  }

  getGoogle() {
    if (isPlatformBrowser(this.platformId)) {
      this.googleService.getAll()
        .subscribe(response => {
          this.googleUA = response;
          ga('create', response.uaCode, 'auto');

          this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
              ga('set', 'page', event.urlAfterRedirects);
              ga('send', 'pageview');
            }
          });
        }, e => console.log(e));
    }
  }

  addSSL(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      var element = $('img[name=ss_imgTag]').detach();
      var element2 = $('#ss_siteSeal_fin_SZ115-55_image_en_V0000_S001').detach();
      $('#selo-alphassl').append(element);
      $('#selo-alphassl').append(element2);
      return true;
    }
    return false;
  }

}
