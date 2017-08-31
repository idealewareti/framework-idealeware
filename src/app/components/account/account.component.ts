import { Component, 
    AfterViewChecked, 
    OnInit, 
    Input } from '@angular/core';
import { Http } from '@angular/http';
import { RouterModule } from '@angular/router';
import { AppSettings } from 'app/app.settings';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute,
    Router,
    Event as RouterEvent,
    NavigationStart,
    NavigationEnd,
    NavigationCancel,
    NavigationError } from '@angular/router';
import { StoreService } from "app/services/store.service";
import { Store } from "app/models/store/store";
import { CustomerService } from "app/services/customer.service";
import { Customer } from "app/models/customer/customer";

//declare var $: any;
declare var S: any;

@Component({
    moduleId: module.id,
    selector: 'account-panel',
    templateUrl: '../../views/account.component.html',
})
export class AccountComponent{
    loading: boolean = true;
    store: Store = new Store;
    customer: Customer = new Customer();

    path: string;
    private actual = { module: '', title : ''};
    private modules = [
        { module: 'home', title: 'Minha Conta', modality: [0,1] },
        { module: 'pedidos', title: 'Meus Pedidos', modality: [1] },
        { module: 'dados-cadastrais', title: 'Meus Dados Cadastrais', modality: [0,1] },
        { module: 'enderecos', title: 'Meus Endereços', modality: [0,1] },
        { module: 'vounchers', title: 'Meus Vales', modality: [1] }
    ];

    constructor(
        private service: CustomerService,
        private titleService: Title, 
        private route: ActivatedRoute,
        private parentRouter: Router,
        private storeService: StoreService,
    ){
        
        window.scrollTo(0, 0); // por causa das hash url
    }

    ngOnInit(){
        if(!this.isLogged())
            this.parentRouter.navigateByUrl('/login');

        this.parentRouter.events.subscribe((url:any) => {
            let path: string = url['url'];
            if(this.validModule(this.path).length > 0){
                this.actual = this.validModule(this.path)[0];
            }
            else{
                this.actual = { module: 'home', title: 'Minha Conta' };
            }
            AppSettings.setTitle(this.actual.title, this.titleService);
        });

        this.storeService.getInfo()
        .then(store => this.store = store)
        .catch(error => console.log(error));

        this.service.getUser()
        .then(customer => this.customer = customer)
        .catch(error => console.log(error));
        
    }

    isMobile(): boolean{
        return AppSettings.isMobile();
    }

    isLogged(): boolean{
        let accessToken: string = localStorage.getItem('auth');
        if(accessToken)
            return true;
        else
            return false;
    }

    private validModule(module: string){
        return this.modules.filter(m => m.module == module);
    }

}