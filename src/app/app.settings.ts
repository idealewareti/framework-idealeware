import { Title } from '@angular/platform-browser';
import { AppConfig } from './app.config';
import { environment } from './../environments/environment'
import { Http } from "@angular/http";
import { AppCore } from "app/app.core";

declare var S: any;

export class AppSettings {

    public static NAME = AppConfig.NAME;
    public static DOMAIN = AppConfig.DOMAIN;
    public static ROOT_PATH = AppConfig.ROOT_PATH;
    public static MEDIA_PATH = AppConfig.MEDIA_PATH;
    public static FACEBOOK_PAGE = AppConfig.FACEBOOK_PAGE;
    public static LOADER_COLOR = AppConfig.LOADER_COLOR;

    public static SELF_COLOR_PALETA = '/assets/services';
    /* APIs */
    public static API_AUTHENTICATE =        AppCore.getAPI(environment, 'API_AUTHENTICATE');
    public static API_BANNER =              AppCore.getAPI(environment, 'API_BANNER');
    public static API_BRANCH =              AppCore.getAPI(environment, 'API_BRANCH');
    public static API_BRAND =               AppCore.getAPI(environment, 'API_BRAND');
    public static API_BUDGET =              AppCore.getAPI(environment, 'API_BUDGET');
    public static API_CART =                AppCore.getAPI(environment, 'API_CART');
    public static API_CARTSHOWCASE =        AppCore.getAPI(environment, 'API_CARTSHOWCASE');
    public static API_CATEGORY =            AppCore.getAPI(environment, 'API_CATEGORY');
    public static API_CONTACT =             AppCore.getAPI(environment, 'API_CONTACT');
    public static API_COUPON =              AppCore.getAPI(environment, 'API_COUPON');
    public static API_CUSTOMER =            AppCore.getAPI(environment, 'API_CUSTOMER');
    public static API_CUSTOMPAINT =         AppCore.getAPI(environment, 'API_CUSTOMPAINT');
    public static API_DNEADDRESS =          AppCore.getAPI(environment, 'API_DNEADDRESS');
    public static API_GOOGLE =              AppCore.getAPI(environment, 'API_GOOGLE');
    public static API_GROUP =               AppCore.getAPI(environment, 'API_GROUP');
    public static API_INSTITUTIONAL =       AppCore.getAPI(environment, 'API_INSTITUTIONAL');
    public static API_INTELIPOST =          AppCore.getAPI(environment, 'API_INTELIPOST');
    public static API_ORDER =               AppCore.getAPI(environment, 'API_ORDER');
    public static API_ORDERVALIDATION =     AppCore.getAPI(environment, 'API_ORDERVALIDATION');
    public static API_PAYMENTS =            AppCore.getAPI(environment, 'API_PAYMENTS');
    public static API_POPUP =               AppCore.getAPI(environment, 'API_POPUP');
    public static API_PRODUCT =             AppCore.getAPI(environment, 'API_PRODUCT');
    public static API_PRODUCTAWAITED =      AppCore.getAPI(environment, 'API_PRODUCTAWAITED');
    public static API_PRODUCTRATING =       AppCore.getAPI(environment, 'API_PRODUCTRATING');
    public static API_REDIRECT301 =         AppCore.getAPI(environment, 'API_REDIRECT301');
    public static API_RELATEDPRODUCTS =     AppCore.getAPI(environment, 'API_RELATEDPRODUCTS');
    public static API_SEARCH =              AppCore.getAPI(environment, 'API_SEARCH');
    public static API_SERVICE =             AppCore.getAPI(environment, 'API_SERVICE');
    public static API_SHOWCASE =            AppCore.getAPI(environment, 'API_SHOWCASE');
    public static API_STORE =               AppCore.getAPI(environment, 'API_STORE');

    /**
     * Consulta Fipe
     * 
     * @static
     * 
     * @memberof AppSettings
     */
    public static API_FIPE = 'https://fipeapi.appspot.com/api/1/carros';

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
    public static isMobile(): boolean {
        let ua = window.navigator.userAgent;
        let check = false;
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(ua)) {
            check = true;
        }

        return check;
    }


    /**
     * Cria um nome amigável para a string
     * 
     * @static
     * @param {string} name 
     * @returns {string} 
     * @memberof AppSettings
     */
    public static getNiceName(name: string): string{
        return S(name.toLowerCase()
            .replace(/ /g, '-')
            .replace(/"/g, '')
            .replace(/'/g, '')
			.replace(/[(]/g, '')
            .replace(/[)]/g, '')
            .replace(/\//g, '-')
        )
        .latinise()
        .s
    }

     /**
     * Valida se um valor é um GUID
     * 
     * @static
     * @param {string} value 
     * @returns {boolean} 
     * @memberof AppSettings
     */
    public static isGuid(value: string): boolean{
        return /^[0-9A-Fa-f]{8}[-]?([[0-9A-Fa-f]{4}[-]?){3}[[0-9A-Fa-f]{12}$/.test(value);
    }

    /**
     * Verifica se uma GUID é nula ou zerada
     * 
     * @static
     * @param {string} value 
     * @returns {boolean} 
     * @memberof AppSettings
     */
    public static isGuidEmpty(value: string): boolean{
        if(value && value == '00000000-0000-0000-0000-000000000000')
            return true;
        return false;
    }

}