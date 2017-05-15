import { Component, 
    AfterViewChecked, 
    OnInit, 
    Input } from '@angular/core';
import { Http } from '@angular/http';
import { RouterModule } from '@angular/router';
import { AppSettings } from '../app.settings';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute,
    Router,
    Event as RouterEvent,
    NavigationStart,
    NavigationEnd,
    NavigationCancel,
    NavigationError } from '@angular/router';
import { Customer } from "../_models/customer/customer";
import { CustomerService } from '../_services/customer.service';
import { Order } from "../_models/order/order";
import { OrderService } from "../_services/order.service";
import { StoreService } from "../_services/store.service";
import { Store } from "../_models/store/store";

//declare var $: any;
declare var S: any;

@Component({
    moduleId: module.id,
    selector: 'account-panel',
    templateUrl: '/views/account.component.html',
})
export class AccountComponent{
    @Input() tabId: string;
    loading: boolean = true;
    private step: string = '';
    private actual = { module: '', title : ''};
    private modules = [
        { module: 'home', title: 'Minha Conta', modality: [0,1] },
        { module: 'pedidos', title: 'Meus Pedidos', modality: [1] },
        { module: 'dados-cadastrais', title: 'Meus Dados Cadastrais', modality: [0,1] },
        { module: 'enderecos', title: 'Meus Endereços', modality: [0,1] },
        { module: 'vounchers', title: 'Meus Vales', modality: [1] }
    ];
    private logged: boolean;
    private customer: Customer = new Customer();
    public store: Store = new Store(); 
    public lastOrder: Order = null;
    
    constructor(
        private service: CustomerService,
        private orderService: OrderService,
        private storeService: StoreService,
        private titleService: Title, 
        private route: ActivatedRoute,
        private parentRouter: Router
    ){
        
        window.scrollTo(0, 0); // por causa das hash url
    }

    ngOnInit(){
        this.route.params
        .map(params => params)
        .subscribe((params) => {
            if(params['step'])
                this.step = params['step'];
            if(params['id'])
                this.tabId = params['id'];

            this.getStore()
            .then(store => {
                return this.getCustomer();
            })
            .catch(() => {
                this.parentRouter.navigateByUrl('/login');
            });

            if(this.store.modality == 1)
                this.orderService.getOrders()
                .then(orders => {
                    if(orders)
                        this.lastOrder = orders[0];
                })
                .catch(error => console.log(error));
        });
        
        
    }

    private getCustomer() : Promise<Customer>{
        return new Promise((resolve, reject) => {
            if(this.logged) {
                resolve(this.customer);
            }
            else{
                this.service.getUser()
                .then(customer => {
                    this.customer = customer;
                    this.logged = true;
                    resolve(customer)
                })
                .catch((error) => {
                    this.logged = false;
                    reject(error);
                });
            }
        });
    }

    public isLogged(){
        return this.logged;
    }

    public open(event, module, id = null) {
        event.preventDefault();
        this.loading = true;
        let url = `/conta/${module}`;
        this.parentRouter.navigateByUrl(url);
        this.step = module;
        this.tabId = id;
        this.loadModule()
        .then(() => this.getCustomer);
    }

    private loadModule(){
        return new Promise((resolve, reject) => {
            if(this.validModule(this.step).length > 0){
                this.actual = this.validModule(this.step)[0];
            }
            else{
                this.actual = { module: 'home', title: 'Minha Conta' };
            }
            this.setTitle(this.actual.title);
            this.loading =  false;
            window.scrollTo(0, 0); // por causa das hash url
            resolve();
        });
    }

    private setTitle( newTitle: string) {
        AppSettings.setTitle(newTitle, this.titleService);
    }

    private validModule(module: string){
        return this.modules.filter(m => m.module == module);
    }

    public getStore():Promise<Store> {
        return new Promise((resolve, reject) => {
            if(this.store)
                resolve(this.store);
            this.storeService.getInfo()
                .then(store => {
                    this.store = store;
                    this.loadModule();
                    resolve(store);
                })
                .catch(error => {
                    console.log(error);
                    reject(error);
                });
        });

    }

    isMobile(): boolean{
        return AppSettings.isMobile();
    }

}