import { Injectable } from "@angular/core";
import { Meta } from "@angular/platform-browser";
import { Product } from "../models/product/product";

@Injectable({
    providedIn: 'root'
})
export class KondutoManager {
    // Metadata Naming
    readonly pageTagName = 'kdt:page';
    readonly pageTagSelector = `name='kdt:page'`;
    readonly productTagName = 'kdt:product';
    readonly productTagSelector = `name='kdt:product'`;

    // Metadata Content
    readonly homeMetaContent = 'home';
    readonly accountMetaContent = 'account';
    readonly cartMetaContent = 'basket';
    readonly checkoutMetaContent = 'checkout';
    readonly productMetaContent = 'product';
    readonly forgotPasswordMetaContent = 'password_reset';
    readonly signupMetaContent = 'account_creation';
    readonly categoryMetaContent = 'category';
    readonly searchMetaContent = 'search';

    // Component Names
    readonly homeComponent = 'Home';
    readonly accountComponent = 'Account';
    readonly cartComponent = 'Basket';
    readonly checkoutComponent = 'Checkout';
    readonly productComponent = 'Product';
    readonly forgotPasswordComponent = 'forgotPassword';
    readonly signupComponent = 'SignUp';
    readonly cagetoryComponent = 'Category';
    readonly searchComponent = 'Search';
    
    constructor(
        private meta: Meta
    ) { }

    public addOrUpdatePageMeta(componentName: string): HTMLMetaElement {
        const kdtPage = this.meta.getTag(this.pageTagSelector);
        const metaContent = this.resolvePageTagName(componentName);
        let result: HTMLMetaElement;
        if (null === metaContent) {
            this.meta.removeTag(this.pageTagSelector);
            return result; 
        }

        if (kdtPage) {
            result = this.meta.updateTag({ name: this.pageTagName, content: metaContent });
        } else {
            result = this.meta.addTag({ name: this.pageTagName, content: metaContent });
        }

        return result;
    }

    public addProductMeta(product: Product): HTMLMetaElement {
        this.clearProductMeta();
        let result: HTMLMetaElement;

        this.meta.addTag({ 
            name: this.productTagName, 
            content: `sku=${product.skuBase.id}, name=${product.name}` 
        });

        return result;
    }

    public clearProductMeta(): void {
        this.meta.removeTag(this.productTagSelector);
    }

    private resolvePageTagName(routeName: string): string {
        if (routeName.includes(this.accountComponent)) {
            return this.accountMetaContent;
        } else if (routeName.includes(this.cartComponent)) {
            return this.cartMetaContent;
        } else if (routeName.includes(this.checkoutComponent)) {
            return this.checkoutMetaContent;
        } else if (routeName.includes(this.productComponent)) {
            return this.productMetaContent;
        } else if (routeName.includes(this.forgotPasswordComponent)) {
            return this.forgotPasswordMetaContent;
        } else if (routeName.includes(this.signupComponent)) {
            return this.signupMetaContent;
        } else if (routeName.includes(this.cagetoryComponent)) {
            return this.categoryMetaContent;
        } else if (routeName.includes(this.homeComponent)) {
            return this.homeMetaContent;
        } else if (routeName.includes(this.searchComponent)) {
            return this.searchMetaContent;
        } else {
            return null;
        }
    }
}