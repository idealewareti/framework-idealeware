export class AppCore{

    /**
     * Retorna a API especificada do ambiente selecionado
     * 
     * @static
     * @param {boolean} environment Ambiente
     * @param {string} key Nome da API
     * @returns {string} 
     * @memberof AppCore
     */
    public static getAPI(environment, key: string): string{
        if(environment.production)
            return this.apiProduction(key);
        else return this.apiDevelopment(key);
    }

    /* DEVELOPMENT */
    private static apiDevelopment(key: string): string{

        let apis: string[] = [];
        apis['API_AUTHENTICATE'] =      'https://api-pub-authenticate.idealeware.com.br:10000';
        apis['API_BANNER'] =            'https://api-pub-banner.idealeware.com.br:10000';
        apis['API_BRANCH'] =            'https://api-pub-branch.idealeware.com.br:10000';
        apis['API_BRAND'] =             'https://api-pub-brand.idealeware.com.br:10000';
        apis['API_BUDGET'] =            'https://api-pub-budget.idealeware.com.br:10000';
        apis['API_CART'] =              'https://api-pub-cart.idealeware.com.br:10000';
        apis['API_CARTSHOWCASE'] =      'https://api-pub-cartshowcase.idealeware.com.br:10000';
        apis['API_CATEGORY'] =          'https://api-pub-category.idealeware.com.br:10000';
        apis['API_CONTACT'] =           'https://api-pub-contact.idealeware.com.br:10000';
        apis['API_COUPON'] =            'https://api-pub-coupon.idealeware.com.br:10000';
        apis['API_CUSTOMER'] =          'https://api-pub-customer.idealeware.com.br:10000';
        apis['API_CUSTOMPAINT'] =       'http://192.168.10.204:7028';
        apis['API_DNEADDRESS'] =        'https://api-pub-dneaddress.idealeware.com.br:10000';
        apis['API_GOOGLE'] =            'https://api-pub-google.idealeware.com.br:10000';
        apis['API_GROUP'] =             'https://api-pub-group.idealeware.com.br:10000';
        apis['API_INSTITUTIONAL'] =     'https://api-pub-institutional.idealeware.com.br:10000';
        apis['API_INTELIPOST'] =        'https://api-pub-intelipost.idealeware.com.br:10000';
        apis['API_ORDER'] =             'https://api-pub-order-stage.idealeware.com.br:10000'; 
        apis['API_ORDERVALIDATION'] =   'https://api-pub-ordervalidation.idealeware.com.br:10000';
        apis['API_PAYMENTS'] =          'https://api-pub-payments.idealeware.com.br:10000';
        apis['API_POPUP'] =             'https://api-pub-popup.idealeware.com.br:10000';
        apis['API_PRODUCT'] =           'https://api-pub-product.idealeware.com.br:10000';
        apis['API_PRODUCTAWAITED'] =    'https://api-pub-productsawaited.idealeware.com.br:10000';
        apis['API_PRODUCTRATING'] =     'https://api-pub-productrating.idealeware.com.br:10000';
        apis['API_SEARCH'] =            'https://api-pub-search.idealeware.com.br:10000';
        apis['API_SERVICE'] =           'https://api-pub-service.idealeware.com.br:10000';
        apis['API_SHOWCASE'] =          'https://api-pub-showcase.idealeware.com.br:10000';
        apis['API_STORE'] =             'https://api-pub-store.idealeware.com.br:10000';

        return apis[key];
    }
    
    /* PRODUCTION */
    /* NÃO ALTERAR */
    private static apiProduction(key: string): string{

        let apis: string[] = [];
        apis['API_AUTHENTICATE'] =      'https://api-pub-authenticate.idealeware.com.br:10000';
        apis['API_BANNER'] =            'https://api-pub-banner.idealeware.com.br:10000';
        apis['API_BRANCH'] =            'https://api-pub-branch.idealeware.com.br:10000';
        apis['API_BRAND'] =             'https://api-pub-brand.idealeware.com.br:10000';
        apis['API_BUDGET'] =            'https://api-pub-budget.idealeware.com.br:10000';
        apis['API_CART'] =              'https://api-pub-cart.idealeware.com.br:10000';
        apis['API_CARTSHOWCASE'] =      'https://api-pub-cartshowcase.idealeware.com.br:10000';
        apis['API_CATEGORY'] =          'https://api-pub-category.idealeware.com.br:10000';
        apis['API_CONTACT'] =           'https://api-pub-contact.idealeware.com.br:10000';
        apis['API_COUPON'] =            'https://api-pub-coupon.idealeware.com.br:10000';
        apis['API_CUSTOMER'] =          'https://api-pub-customer.idealeware.com.br:10000';
        apis['API_CUSTOMPAINT'] =       'https://api-pub-custompaint.idealeware.com.br:10000';
        apis['API_DNEADDRESS'] =        'https://api-pub-dneaddress.idealeware.com.br:10000';
        apis['API_GOOGLE'] =            'https://api-pub-google.idealeware.com.br:10000';
        apis['API_GROUP'] =             'https://api-pub-group.idealeware.com.br:10000';
        apis['API_INSTITUTIONAL'] =     'https://api-pub-institutional.idealeware.com.br:10000';
        apis['API_INTELIPOST'] =        'https://api-pub-intelipost.idealeware.com.br:10000';
        apis['API_ORDER'] =             'https://api-pub-order.idealeware.com.br:10000'; 
        apis['API_ORDERVALIDATION'] =   'https://api-pub-ordervalidation.idealeware.com.br:10000';
        apis['API_PAYMENTS'] =          'https://api-pub-payments.idealeware.com.br:10000';
        apis['API_POPUP'] =             'https://api-pub-popup.idealeware.com.br:10000';
        apis['API_PRODUCT'] =           'https://api-pub-product.idealeware.com.br:10000';
        apis['API_PRODUCTAWAITED'] =    'https://api-pub-productsawaited.idealeware.com.br:10000';
        apis['API_PRODUCTRATING'] =     'https://api-pub-productrating.idealeware.com.br:10000';
        apis['API_SEARCH'] =            'https://api-pub-search.idealeware.com.br:10000';
        apis['API_SERVICE'] =           'https://api-pub-service.idealeware.com.br:10000';
        apis['API_SHOWCASE'] =          'https://api-pub-showcase.idealeware.com.br:10000';
        apis['API_STORE'] =             'https://api-pub-store.idealeware.com.br:10000';

        return apis[key];
    }

}