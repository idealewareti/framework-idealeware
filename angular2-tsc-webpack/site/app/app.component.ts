import {Component, OnInit, AfterViewChecked} from '@angular/core';
import {Http} from '@angular/http';
import {AppSettings} from './app.settings';
import {
    Router,
    Event as RouterEvent,
    NavigationStart,
    NavigationEnd,
    NavigationCancel,
    NavigationError
} from '@angular/router'
import {NgProgressService} from 'ngx-progressbar';
import {StoreService} from './_services/store.service';
import { CartManager } from "./_managers/cart.manager";
import { Cart } from "./_models/cart/cart";
import { Store } from "./_models/store/store";
import { GoogleService } from "./_services/google.service";
import { Google } from "./_models/google/google";

declare var S: any;
declare var ga: any;
//declare var $: any;

@Component({
    moduleId: module.id,
    selector: 'app',
    templateUrl: '/views/app.component.html'
})
export class AppComponent implements OnInit {
    cart: Cart;
    store: Store;
    googleUA: Google;
    private path: string;

    constructor(
        private loaderService: NgProgressService,
        private router: Router,
        private service: StoreService,
        private googleService: GoogleService,
        private cartManager: CartManager,
    ) {
        
        if(!this.getSessionId())
            this.setSessionId();
        
        this.loaderService.start();
        this.service.setUp();
    }

    ngOnInit() {
        this.service.getInfo()
            .then(store => this.store = store)
            .catch(error => console.log(error));
        
        this.getGoogle();
    }

    ngAfterViewChecked() {
        this.checkSessionId();
        this.getUrl();

        if(this.isMobile()){
            if(!$('body').hasClass('mobile-body'))
                $('body').addClass('mobile-body').removeClass('desktop-body');
        }
        else{
            $('body').removeClass('mobile-body').addClass('desktop-body');
        }
    }

    setSessionId(){
        let guid = AppSettings.createGuid();
        localStorage.setItem('session_id', guid);
    }

    checkSessionId(){
        if(!this.getSessionId())
            this.setSessionId();
    }

    private getUrl() {
        this.router.events.subscribe((url: any) => this.path = url['url']);
    }

    getSessionId(): string{
        return localStorage.getItem('session_id');
    }

    getGoogle(){
        this.googleService.getAll()
        .then(response => {
            this.googleUA = response;
            ga('create', response.uaCode, 'auto');

            this.router.events.subscribe(event => {
                if (event instanceof NavigationEnd) {
                    ga('set', 'page', event.urlAfterRedirects);
                    ga('send', 'pageview');
                }
            });
        })
        .catch(e => console.log(e));
    }

    isMobile(): boolean{
        return AppSettings.isMobile();
    }
}