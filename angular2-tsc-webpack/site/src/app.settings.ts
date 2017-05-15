import { Title } from '@angular/platform-browser';
import { AppConfig } from './app.config';

export class AppSettings {

    public static NAME = AppConfig.NAME;
    public static DOMAIN = AppConfig.DOMAIN;
    public static ROOT_PATH = AppConfig.ROOT_PATH;
    public static MEDIA_PATH = AppConfig.MEDIA_PATH;

    public static SELF_COLOR_PALETA = '/services';
    /* APi's */
    public static API_AUTHENTICATE = 'https://api-pub-authenticate.idealeware.com.br:10000';
    public static API_BANNER = 'https://api-pub-banner.idealeware.com.br:10000';
    public static API_BRANCH = 'https://api-pub-branch.idealeware.com.br:10000';
    public static API_BRAND = 'https://api-pub-brand.idealeware.com.br:10000'; 
    public static API_BUDGET = 'https://api-pub-budget.idealeware.com.br:10000';
    public static API_CART = 'https://api-pub-cart.idealeware.com.br:10000'; 
    public static API_CARTSHOWCASE = 'https://api-pub-cartshowcase.idealeware.com.br:10000';
    public static API_CATEGORY =  'https://api-pub-category.idealeware.com.br:10000';
    public static API_CONTACT = 'https://api-pub-contact.idealeware.com.br:10000';
    public static API_COUPON = 'https://api-pub-coupon.idealeware.com.br:10000';
    public static API_CUSTOMER = 'https://api-pub-customer.idealeware.com.br:10000';
    public static API_DNEADDRESS = 'https://api-pub-dneaddress.idealeware.com.br:10000';
    public static API_GOOGLE = 'https://api-pub-google.idealeware.com.br:10000';
    public static API_GROUP = 'https://api-pub-group.idealeware.com.br:10000';
    public static API_INSTITUTIONAL = 'https://api-pub-institutional.idealeware.com.br:10000';
    public static API_INTELIPOST = 'https://api-pub-intelipost.idealeware.com.br:10000';
    public static API_ORDER = 'https://api-pub-order.idealeware.com.br:10000'; 
    public static API_ORDERVALIDATION = 'https://api-pub-ordervalidation.idealeware.com.br:10000';
    public static API_PAYMENTS = 'https://api-pub-payments.idealeware.com.br:10000'; 
    public static API_POPUP = 'https://api-pub-popup.idealeware.com.br:10000';
    public static API_PRODUCT = 'https://api-pub-product.idealeware.com.br:10000';
    public static API_PRODUCTAWAITED = 'https://api-pub-productsawaited.idealeware.com.br:10000';
    public static API_PRODUCTRATING = 'https://api-pub-productrating.idealeware.com.br:10000';
    public static API_SEARCH = 'https://api-pub-search.idealeware.com.br:10000';
    public static API_SERVICE = 'https://api-pub-service.idealeware.com.br:10000';
    public static API_SHOWCASE = 'https://api-pub-showcase.idealeware.com.br:10000';
    public static API_STORE = 'https://api-pub-store.idealeware.com.br:10000';

    
    /**
     * Consulta Fipe
     * 
     * @static
     * 
     * @memberof AppSettings
     */
    public static API_FIPE = 'http://fipeapi.appspot.com/api/1/carros';

    
    /**
     * Adiciona o título à página
     * 
     * @static
     * @param {string} title 
     * @param {Title} titleService 
     * 
     * @memberof AppSettings
     */
    public static setTitle(title: string, titleService: Title) {
        let defaultTitle = AppConfig.NAME;
        titleService.setTitle(`${title} | ${defaultTitle}`);
    }

    
    /**
     * Cria uma GUID
     * 
     * @static
     * @returns 
     * 
     * @memberof AppSettings
     */
    public static createGuid() {
        return (this.S4() + this.S4() + "-" + this.S4() + "-4" + this.S4().substr(0, 3) + "-" + this.S4() + "-" + this.S4() + this.S4() + this.S4()).toLowerCase();
    }

    private static S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }

    
    /**
     * Verifica se o user agent é mobile
     * 
     * @static
     * @returns {boolean} 
     * 
     * @memberof AppSettings
     */
    public static isMobile(): boolean{
        let ua = window.navigator.userAgent;
        let check = false;
        if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(ua)){
            check = true;
        }

        return check;
    }

}