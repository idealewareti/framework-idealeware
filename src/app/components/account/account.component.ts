import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { Customer } from '../../models/customer/customer';
import { Store } from '../../models/store/store';
import { isPlatformBrowser } from '@angular/common';
import { AppCore } from '../../app.core';
import { StoreManager } from '../../managers/store.manager';
import { CustomerManager } from '../../managers/customer.manager';
import { SeoManager } from '../../managers/seo.manager';

@Component({
    selector: 'account-panel',
    templateUrl: '../../templates/account/account/account.html',
    styleUrls: ['../../templates/account/account/account.scss']
})
export class AccountComponent implements OnInit {

    loading: boolean = true;
    store: Store = new Store;
    customer: Customer = new Customer();

    private actual = { module: 'home', title: 'Minha Conta' };
    private modules = [
        { module: 'home', title: 'Minha Conta', modality: [0, 1] },
        { module: 'pedidos', title: 'Meus Pedidos', modality: [1] },
        { module: 'dados-cadastrais', title: 'Meus Dados Cadastrais', modality: [0, 1] },
        { module: 'enderecos', title: 'Meus Endereços', modality: [0, 1] },
        { module: 'vounchers', title: 'Meus Vales', modality: [1] }
    ];

    constructor(
        private router: Router,
        private customerManager: CustomerManager,
        private storeManager: StoreManager,
        private seoManager: SeoManager,
        @Inject(PLATFORM_ID) private platformId: Object,
    ) { }


    ngOnInit() {
        this.router.events.subscribe(() => {
            if (this.router.url.includes("/conta/")) {
                let new_module = this.validModule(this.router.url);

                if (new_module) {
                    this.actual = new_module;
                }
                else {
                    this.actual = { module: 'home', title: 'Minha Conta' };
                }

                this.seoManager.setTags({
                    title: this.actual.title
                });
            }
        });

        this.storeManager.getStore()
            .subscribe(store => {
                this.store = store;
                this.customerManager.getCustomer()
                    .subscribe(customer => {
                        if (!customer) this.router.navigateByUrl('/');
                        this.customer = customer;
                    });
            });
    }

    isMobile(): boolean {
        if (isPlatformBrowser(this.platformId)) {
            return AppCore.isMobile(window);
        }
        else return false;
    }

    private validModule(module: string) {
        return this.modules.find(m => module.includes(m.module));
    }

    logout(){
        this.customerManager.logOff();
        this.router.navigate[''];
    }
}