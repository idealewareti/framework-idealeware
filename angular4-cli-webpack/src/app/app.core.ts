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

    
// ______               _                                  _   
// |  _  \             | |                                | |  
// | | | |_____   _____| | ___  _ __  _ __ ___   ___ _ __ | |_ 
// | | | / _ \ \ / / _ \ |/ _ \| '_ \| '_ ` _ \ / _ \ '_ \| __|
// | |/ /  __/\ V /  __/ | (_) | |_) | | | | | |  __/ | | | |_ 
// |___/ \___| \_/ \___|_|\___/| .__/|_| |_| |_|\___|_| |_|\__|
//                             | |                             
//                             |_|                             
    private static apiDevelopment(key: string): string{
        let apis: string[] = [];
        apis['API_AUTHENTICATE'] =          'https://api-pub-authenticate.idealeware.com.br:10000';
        apis['API_BANNER'] =                'https://api-pub-banner.idealeware.com.br:10000';
        apis['API_BRANCH'] =                'https://api-pub-branch.idealeware.com.br:10000';
        apis['API_BRAND'] =                 'https://api-pub-brand.idealeware.com.br:10000';
        apis['API_BUDGET'] =                'https://api-pub-budget.idealeware.com.br:10000';
        apis['API_CART'] =                  'https://api-pub-cart.idealeware.com.br:10000';
        apis['API_CARTSHOWCASE'] =          'https://api-pub-cartshowcase.idealeware.com.br:10000';
        apis['API_CATEGORY'] =              'https://api-pub-category.idealeware.com.br:10000';
        apis['API_CONTACT'] =               'https://api-pub-contact.idealeware.com.br:10000';
        apis['API_COUPON'] =                'https://api-pub-coupon.idealeware.com.br:10000';
        apis['API_CUSTOMER'] =              'https://api-pub-customer.idealeware.com.br:10000';
        apis['API_CUSTOMPAINT'] =           'https://api-pub-custompaint.idealeware.com.br:10000';
        apis['API_DNEADDRESS'] =            'https://api-pub-dneaddress.idealeware.com.br:10000';
        apis['API_GOOGLE'] =                'https://api-pub-google.idealeware.com.br:10000';
        apis['API_GROUP'] =                 'https://api-pub-group.idealeware.com.br:10000';
        apis['API_INSTITUTIONAL'] =         'https://api-pub-institutional.idealeware.com.br:10000';
        apis['API_INTELIPOST'] =            'https://api-pub-intelipost.idealeware.com.br:10000';
        apis['API_ORDER'] =                 'https://api-pub-order.idealeware.com.br:10000'; 
        apis['API_ORDERVALIDATION'] =       'https://api-pub-ordervalidation.idealeware.com.br:10000';
        apis['API_PAYMENTS'] =              'https://api-pub-payments.idealeware.com.br:10000';
        apis['API_POPUP'] =                 'https://api-pub-popup.idealeware.com.br:10000';
        apis['API_PRODUCT'] =               'https://api-pub-product.idealeware.com.br:10000';
        apis['API_PRODUCTAWAITED'] =        'https://api-pub-productsawaited.idealeware.com.br:10000';
        apis['API_PRODUCTRATING'] =         'https://api-pub-productrating.idealeware.com.br:10000';
        apis['API_RELATEDPRODUCTS'] =       'https://api-pub.relatedproducts.idealeware.com.br:1000';
        apis['API_SEARCH'] =                'https://api-pub-search.idealeware.com.br:10000';
        apis['API_SERVICE'] =               'https://api-pub-service.idealeware.com.br:10000';
        apis['API_SHOWCASE'] =              'https://api-pub-showcase.idealeware.com.br:10000';
        apis['API_STORE'] =                 'https://api-pub-store.idealeware.com.br:10000';
        return apis[key];
    }

    
//  _____ _                   
// /  ___| |                  
// \ `--.| |_ __ _  __ _  ___ 
//  `--. \ __/ _` |/ _` |/ _ \
// /\__/ / || (_| | (_| |  __/
// \____/ \__\__,_|\__, |\___|
//                  __/ |     
//                 |___/      
    private static apiStage(key: string): string{
        let apis: string[] = [];
        apis['API_AUTHENTICATE'] =          'https://api-pub-authenticate-stage.idealeware.com.br:10000';
        apis['API_BANNER'] =                'https://api-pub-banner-stage.idealeware.com.br:10000';
        apis['API_BRANCH'] =                'https://api-pub-branch-stage.idealeware.com.br:10000';
        apis['API_BRAND'] =                 'https://api-pub-brand-stage.idealeware.com.br:10000';
        apis['API_BUDGET'] =                'https://api-pub-budget-stage.idealeware.com.br:10000';
        apis['API_CART'] =                  'https://api-pub-cart-stage.idealeware.com.br:10000';
        apis['API_CARTSHOWCASE'] =          'https://api-pub-cartshowcase-stage.idealeware.com.br:10000';
        apis['API_CATEGORY'] =              'https://api-pub-category-stage.idealeware.com.br:10000';
        apis['API_CONTACT'] =               'https://api-pub-contact-stage.idealeware.com.br:10000';
        apis['API_COUPON'] =                'https://api-pub-coupon-stage.idealeware.com.br:10000';
        apis['API_CUSTOMER'] =              'https://api-pub-customer-stage.idealeware.com.br:10000';
        apis['API_CUSTOMPAINT'] =           'https://api-pub-custompaint-stage.idealeware.com.br:10000';
        apis['API_DNEADDRESS'] =            'https://api-pub-dneaddress-stage.idealeware.com.br:10000';
        apis['API_GOOGLE'] =                'https://api-pub-google-stage.idealeware.com.br:10000';
        apis['API_GROUP'] =                 'https://api-pub-group-stage.idealeware.com.br:10000';
        apis['API_INSTITUTIONAL'] =         'https://api-pub-institutional-stage.idealeware.com.br:10000';
        apis['API_INTELIPOST'] =            'https://api-pub-intelipost-stage.idealeware.com.br:10000';
        apis['API_ORDER'] =                 'https://api-pub-order-stage.idealeware.com.br:10000'; 
        apis['API_ORDERVALIDATION'] =       'https://api-pub-ordervalidation-stage.idealeware.com.br:10000';
        apis['API_PAYMENTS'] =              'https://api-pub-payments-stage.idealeware.com.br:10000';
        apis['API_POPUP'] =                 'https://api-pub-popup-stage.idealeware.com.br:10000';
        apis['API_PRODUCT'] =               'https://api-pub-product-stage.idealeware.com.br:10000';
        apis['API_PRODUCTAWAITED'] =        'https://api-pub-productsawaited-stage.idealeware.com.br:10000';
        apis['API_PRODUCTRATING'] =         'https://api-pub-productrating-stage.idealeware.com.br:10000';
        apis['API_RELATEDPRODUCTS'] =       'https://api-pub.relatedproducts-stage.idealeware.com.br:1000';
        apis['API_SEARCH'] =                'https://api-pub-search-stage.idealeware.com.br:10000';
        apis['API_SERVICE'] =               'https://api-pub-service-stage.idealeware.com.br:10000';
        apis['API_SHOWCASE'] =              'https://api-pub-showcase-stage.idealeware.com.br:10000';
        apis['API_STORE'] =                 'https://api-pub-store-stage.idealeware.com.br:10000';
        return apis[key];
    }
    
    
// ______              _            _   _             
// | ___ \            | |          | | (_)            
// | |_/ / __ ___   __| |_   _  ___| |_ _  ___  _ __  
// |  __/ '__/ _ \ / _` | | | |/ __| __| |/ _ \| '_ \ 
// | |  | | | (_) | (_| | |_| | (__| |_| | (_) | | | |
// \_|  |_|  \___/ \__,_|\__,_|\___|\__|_|\___/|_| |_|
private static apiProduction(key: string): string{
        let apis: string[] = [];
        apis['API_AUTHENTICATE'] =          'https://api-pub-authenticate.idealeware.com.br:10000';
        apis['API_BANNER'] =                'https://api-pub-banner.idealeware.com.br:10000';
        apis['API_BRANCH'] =                'https://api-pub-branch.idealeware.com.br:10000';
        apis['API_BRAND'] =                 'https://api-pub-brand.idealeware.com.br:10000';
        apis['API_BUDGET'] =                'https://api-pub-budget.idealeware.com.br:10000';
        apis['API_CART'] =                  'https://api-pub-cart.idealeware.com.br:10000';
        apis['API_CARTSHOWCASE'] =          'https://api-pub-cartshowcase.idealeware.com.br:10000';
        apis['API_CATEGORY'] =              'https://api-pub-category.idealeware.com.br:10000';
        apis['API_CONTACT'] =               'https://api-pub-contact.idealeware.com.br:10000';
        apis['API_COUPON'] =                'https://api-pub-coupon.idealeware.com.br:10000';
        apis['API_CUSTOMER'] =              'https://api-pub-customer.idealeware.com.br:10000';
        apis['API_CUSTOMPAINT'] =           'https://api-pub-custompaint.idealeware.com.br:10000';
        apis['API_DNEADDRESS'] =            'https://api-pub-dneaddress.idealeware.com.br:10000';
        apis['API_GOOGLE'] =                'https://api-pub-google.idealeware.com.br:10000';
        apis['API_GROUP'] =                 'https://api-pub-group.idealeware.com.br:10000';
        apis['API_INSTITUTIONAL'] =         'https://api-pub-institutional.idealeware.com.br:10000';
        apis['API_INTELIPOST'] =            'https://api-pub-intelipost.idealeware.com.br:10000';
        apis['API_ORDER'] =                 'https://api-pub-order.idealeware.com.br:10000'; 
        apis['API_ORDERVALIDATION'] =       'https://api-pub-ordervalidation.idealeware.com.br:10000';
        apis['API_PAYMENTS'] =              'https://api-pub-payments.idealeware.com.br:10000';
        apis['API_POPUP'] =                 'https://api-pub-popup.idealeware.com.br:10000';
        apis['API_PRODUCT'] =               'https://api-pub-product.idealeware.com.br:10000';
        apis['API_PRODUCTAWAITED'] =        'https://api-pub-productsawaited.idealeware.com.br:10000';
        apis['API_PRODUCTRATING'] =         'https://api-pub-productrating.idealeware.com.br:10000';
        apis['API_RELATEDPRODUCTS'] =       'https://api-pub.relatedproducts.idealeware.com.br:1000';
        apis['API_SEARCH'] =                'https://api-pub-search.idealeware.com.br:10000';
        apis['API_SERVICE'] =               'https://api-pub-service.idealeware.com.br:10000';
        apis['API_SHOWCASE'] =              'https://api-pub-showcase.idealeware.com.br:10000';
        apis['API_STORE'] =                 'https://api-pub-store.idealeware.com.br:10000';

        return apis[key];
    }

}

