import { Component, AfterViewChecked, OnInit, Input, PLATFORM_ID, Inject } from '@angular/core';
import { Http } from '@angular/http';
import { RouterModule } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router, Event as RouterEvent, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { Customer } from '../../models/customer/customer';
import { Store } from '../../models/store/store';
import { CustomerService } from '../../services/customer.service';
import { isPlatformBrowser } from '@angular/common';
import { AppCore } from '../../app.core';
import { Token } from '../../models/customer/token';
import { StoreManager } from '../../managers/store.manager';

//declare var $: any;
declare var S: any;

@Component({
    moduleId: module.id,
    selector: 'app-account-panel',
    templateUrl: '../../template/account/account/account.html',
    styleUrls: ['../../template/account/account/account.scss']
})
export class AccountComponent {
    loading: boolean = true;
    store: Store = new Store;
    customer: Customer = new Customer();

    path: string;
    private actual = { module: '', title: '' };
    private modules = [
        { module: 'home', title: 'Minha Conta', modality: [0, 1] },
        { module: 'pedidos', title: 'Meus Pedidos', modality: [1] },
        { module: 'dados-cadastrais', title: 'Meus Dados Cadastrais', modality: [0, 1] },
        { module: 'enderecos', title: 'Meus Endereços', modality: [0, 1] },
        { module: 'vounchers', title: 'Meus Vales', modality: [1] }
    ];

    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
        private service: CustomerService,
        private titleService: Title,
        private route: ActivatedRoute,
        private parentRouter: Router,
        private storeManager: StoreManager
    ) { }


    ngOnInit() {
        if (!this.isLogged())
            this.parentRouter.navigateByUrl('/login');

        this.parentRouter.events.subscribe((url: any) => {
            let path: string = url['url'];
            if (this.validModule(this.path).length > 0) {
                this.actual = this.validModule(this.path)[0];
            }
            else {
                this.actual = { module: 'home', title: 'Minha Conta' };
            }
            this.titleService.setTitle(this.actual.title);
        });

        this.storeManager.getStore()
            .then(store => {
                this.store = store;
                let token: Token = this.getToken();
                this.service.getUser(token)
                    .subscribe(customer => this.customer = customer),
                    (error => console.log(error));
            })
            .catch(error => {
                console.log(error);
            })

    }

    isMobile(): boolean {
        if (isPlatformBrowser(this.platformId)) {
            return AppCore.isMobile(window);
        }
        else return false;
    }

    isLogged(): boolean {
        let accessToken: string = localStorage.getItem('auth');
        if (accessToken)
            return true;
        else
            return false;
    }

    private validModule(module: string) {
        return this.modules.filter(m => m.module == module);
    }

    private getToken(): Token {
        let token = new Token();
        if (isPlatformBrowser(this.platformId)) {
            token = new Token();
            token.accessToken = localStorage.getItem('auth');
            token.createdDate = new Date(localStorage.getItem('auth_create'));
            token.expiresIn = Number(localStorage.getItem('auth_expires'));
            token.tokenType = 'Bearer';
        }
        return token;
    }

}