import {
	Component, OnInit, Inject, PLATFORM_ID,
	AfterViewInit, ElementRef, Renderer2, ViewChild, ChangeDetectionStrategy
} from '@angular/core';
import { SafeResourceUrl, DomSanitizer, Meta } from '@angular/platform-browser';
import { Store } from './models/store/store';
import { Router, NavigationEnd, ActivationStart, NavigationStart } from '@angular/router';
import { Institutional } from './models/institutional/institutional';
import { AppCore } from './app.core';
import { isPlatformBrowser } from '@angular/common';
import { Payment } from './models/payment/payment';
import { Customer } from './models/customer/customer';
import { EnumStoreModality } from './enums/store-modality.enum';
import { AppConfig } from './app.config';
import { PaymentManager } from './managers/payment.manager';
import { PaymentMethod } from './models/payment/payment-method';
import { CustomerManager } from './managers/customer.manager';
import { StoreManager } from './managers/store.manager';
import { KondutoManager } from './managers/konduto.manager';
import { InstitutionalManager } from './managers/institutional.manager';
import { GoogleManager } from './managers/google.manager';

declare var $: any;
declare var dataLayer: any;

@Component({
	selector: 'app-root',
	templateUrl: './templates/app.html'
})
export class AppComponent implements OnInit, AfterViewInit {

	private store: Store;
	private facebookSafeUrl: SafeResourceUrl;
	private institutionals: Institutional[] = [];
	private payments: Payment[] = [];
	private customer: Customer = null;

	q: string = '';

	@ViewChild('konduto') kondutoContainer: ElementRef;

	constructor(
		private router: Router,
		private sanitizer: DomSanitizer,
		private storeManager: StoreManager,
		private institutionalManager: InstitutionalManager,
		private paymentManager: PaymentManager,
		private googleManager: GoogleManager,
		private customerManager: CustomerManager,
		private kondutoManager: KondutoManager,
		private renderer: Renderer2,
		private meta: Meta,
		@Inject(PLATFORM_ID) private platformId: Object
	) {
		// Antifraude precisa ser o primeiro a carregar para que as metas já venham contempladas
		if (this.isKondutoActived()) {
			this.kondutoManager.addOrUpdatePageMeta('Home');
		}
	}

	ngOnInit() {
		this.storeManager.getStore()
			.subscribe(store => {
				this.store = store;

				this.loadPagesInstitutionals();

				if (this.isKondutoActived()) {
					this.injectKondutoScript(this.store.kondutoPublicKey);
				}

				this.loadGoogle();

				if (this.store.modality == EnumStoreModality.Ecommerce) {
					this.loadPayments();
				}

				this.loadFacebookUrl();
			});
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
			$('#btn-search').click(function () {
				$('#search-box .mask').hide();
				$('#search-box #form-search').css('top', '-100%');
				$('#search-box').show();
				$('#search-box .mask').fadeIn(300);
				$('#search-box #form-search').css('top', 0);
				return false;
			});
			$('#search-box .btn-close,#search-box .mask').click(function () {
				$('#search-box #form-search').css('top', '-100%');
				$('#search-box .mask').fadeOut(300, function () {
					$('#search-box').hide();
				});

				return false;
			});
		}
	}

    /**
     * Retorna a loja
     * @returns {Store} 
     * @memberof AppComponent
     */
	getStore(): Store {
		return this.store;
	}

	/**
     * Retorna a link do telefone
     * @returns {string} 
     * @memberof AppComponent
     */
	getPhoneLink(): string {
		return `tel:${this.store.phone}`;
	}

    /**
     * Retorna os dados do cliente
	 * @returns {Customer} 
     * @memberof AppComponent
     */
	getCustomer(): Customer {
		return this.customer;
	}

    /**
     * Retorna as páginas institucionais
     * @returns {Institutional[]}
     * @memberof AppComponent
     */
	getInstitutionals(): Institutional[] {
		return this.institutionals;
	}

    /**
     * Retorna a URLs da página institucional
     * @param {Institutional} page 
     * @returns {string} 
     * @memberof AppComponent
     */
	getInstitutionalUrl(page: Institutional): string {
		if (page.allowDelete)
			return `/institucional/${AppCore.getNiceName(page.title)}-${page.id}`;
		else
			return '/contato';
	}

    /**
     * Retorna os pagamentos da loja
     * @returns {Payment[]} 
     * @memberof AppComponent
     */
	getPayments(): Payment[] {
		return this.payments;
	}

	/**
     * Retorna url logo normal
     * @returns {string} 
     * @memberof AppComponent
     */
	getLogoPath(): string {
		return `${this.store.link}/static/store/${this.store.logo}`;
	}

	/**
     * Retorna url logo normal
     * @returns {string} 
     * @memberof AppComponent
     */
	getLogoMobilePath(): string {
		return `${this.store.link}/static/store/${this.store.logoMobile}`;
	}

	/**
	 * Retorna o url da página do Facebook da loja
	 * @returns {SafeResourceUrl} 
	 * @memberof AppComponent
	 */
	getFacebookUrl(): SafeResourceUrl {
		return this.facebookSafeUrl;
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
	 * logout do cliente
	 * @memberof AppComponent
	 */
	logout() {
		this.customerManager.logOff();
	}

	/**
	 * Valida se a página atual é checkout
	 * @returns {boolean} 
	 * @memberof AppComponent
	 */
	isCheckout(): boolean {
		let urlCurrent = this.router.url;

		if (urlCurrent.startsWith("/checkout") ||
			urlCurrent.startsWith("/checkout/orcamento")) {
			return true;
		}

		return false;
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
		return false;
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
	 * Verifica se loja está carregada
	 * @returns {boolean} 
	 * @memberof AppComponent
	 */
	isStore(): boolean {
		return this.store != null;
	}

	/**
	 * Verifica se loja está carregada
	 * @returns {boolean} 
	 * @memberof AppComponent
	 */
	isCustomer(): boolean {
		return this.customer != null;
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
	 * Verifica se a loja possui Mundipagg
	 * @returns {boolean} 
	 * @memberof AppComponent
	 */
	hasMundipagg(): boolean {
		return this.paymentManager.hasMundipagg(this.payments);
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
	 * Adiciona o script do Mercado Pago na loja
	 * @memberof AppComponent
	 */
	private addMercadoPago() {
		if (isPlatformBrowser(this.platformId)) {
			if (this.store && this.store.modality == EnumStoreModality.Ecommerce && this.hasMercadoPago()) {
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
	private addPagseguro() {
		if (isPlatformBrowser(this.platformId)) {
			if (this.store && this.store.modality == EnumStoreModality.Ecommerce && this.hasPagSeguro()) {
				var s = document.createElement('script');
				s.type = 'text/javascript';
				s.src = (this.getPagSeguro().isSandBox) ? 'https://stc.sandbox.pagseguro.uol.com.br/pagseguro/api/v2/checkout/pagseguro.directpayment.js' : 'https://stc.pagseguro.uol.com.br/pagseguro/api/v2/checkout/pagseguro.directpayment.js';
				$('body').append(s);
			}
		}
	}

	/**
	 * Retorna o Pagseguro da loja
	 * @returns {Payment} 
	 * @memberof AppComponent
	 */
	private getPagSeguro(): Payment {
		return this.paymentManager.getPagSeguro(this.payments);
	}

	/**
	 * Cria uma nova sessão na loja
	 * @memberof AppComponent
	 */
	private setSessionId() {
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
	private checkSessionId() {
		if (!this.getSessionId()) {
			this.setSessionId();
		}
	}

	/**
	 * Retorna a sessão criada
	 * @returns {string} 
	 * @memberof AppComponent
	 */
	private getSessionId(): string {
		if (isPlatformBrowser(this.platformId)) {
			return localStorage.getItem('session_id');
		}
		return null;
	}

	/**
	* Mantém o site sempre em https
	* (exceto quando ele estiver rodando em localhost)
	* @memberof AppComponent
	*/
	private keepHttps() {
		if (isPlatformBrowser(this.platformId)) {
			if (location.href.indexOf("https://") == -1 && location.hostname != 'localhost' && !/^\d+[.]/.test(location.hostname)) {
				location.href = location.href.replace("http://", "https://");
			}
		}
	}

	/**
     * carrega as páginas institucionais
     * @returns 
     * @memberof AppComponent
     */
	private loadPagesInstitutionals() {
		if (isPlatformBrowser(this.platformId)) {
			this.institutionalManager.getAll()
				.subscribe(response => {
					this.institutionals = response
				});
		}
	}

	/**
     * carrega os pagamentos da loja
     * @returns 
     * @memberof AppComponent
     */
	private loadPayments() {
		if (isPlatformBrowser(this.platformId)) {
			this.paymentManager.getAll()
				.subscribe(payments => {
					this.payments = payments;
					this.addPagseguro();
					this.addMercadoPago();
				});
		}
	}

	/**
	 * carrega o UA-Code do Google Analytics no site
	 * @memberof AppComponent
	 */
	private loadGoogle() {
		if (isPlatformBrowser(this.platformId)) {
			this.googleManager.getAll()
				.subscribe(google => {
					this.injectGoogleManagerScript(google.uaCode);
					this.injectGoogleSiteVerification(google.siteVerification);
				});
		}
	}

	/**
	 * carrega a url do Facebook 
	 * @returns
	 * @memberof AppComponent
	 */
	private loadFacebookUrl() {
		if (isPlatformBrowser(this.platformId)) {
			let url = `https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2F${AppConfig.FACEBOOK_PAGE}%2F&tabs&width=340&height=214&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId=214403341930049`;
			this.facebookSafeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
		}
	}

	/**
     * carrega os dados do cliente
     * @memberof AppComponent
     */
	private loadCustomer() {
		this.customerManager.getCustomer()
			.subscribe(user => {
				this.customer = user;
			}, () => {
				this.customer = null;
			});
	}

    /**
     * verificar rotas
     * @private
     * @memberof AppComponent
     */
	private checkRouter() {

		/*Capturar mudanças na rotas para da um scroll para topo */
		this.router.events.subscribe((evt) => {

			$('#navbar.collapse').collapse('hide');

			if (evt instanceof ActivationStart) {
				const routeName = evt.snapshot.data.name || '';
				this.kondutoManager.addOrUpdatePageMeta(routeName);
			}

			let path = evt['url'];
			if (path && !path.includes('q=')) {
				this.q = '';
			}

			if (!(evt instanceof NavigationEnd)) {
				return;
			}

			window.scrollTo(0, 0);

			this.keepHttps();
			this.checkSessionId();

			this.loadCustomer();

			dataLayer.push({
				'event': 'PageView',
				'Page Path': evt.urlAfterRedirects
			});
		});
	}

	/**
     * injeta script konduto na loja
	 * @param {string} key 
     * @private
     * @memberof AppComponent
     */
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

	/**
     * injeta script google tagmanger na loja
	 * @param {string} key 
     * @private
     * @memberof AppComponent
     */
	private injectGoogleManagerScript(code: string): void {
		if (isPlatformBrowser(this.platformId)) {
			if (!code) return;
			let script = this.renderer.createElement('script');
			const content = `
			(function (w, d, s, l, i) {
				w[l] = w[l] || []; w[l].push({
					'gtm.start':
						new Date().getTime(), event: 'gtm.js'
				}); var f = d.getElementsByTagName(s)[0],
					j = d.createElement(s), dl = l != 'dataLayer' ? '&l=' + l : ''; j.async = true; j.src =
						'https://www.googletagmanager.com/gtm.js?id=' + i + dl; f.parentNode.insertBefore(j, f);
				})(window, document, 'script', 'dataLayer', '${code}');
			`
			script.innerHTML = content;
			document.head.appendChild(script);
		}
	}
	/**
	 * Injeta o script Google Site Verification
	 * @param code 
	 */
	private injectGoogleSiteVerification(code :string) :void{
		if(isPlatformBrowser(this.platformId)){
			if(!code) return;
			this.meta.addTag({name: 'google-site-verification', content: code});
		}
	}
	

}
