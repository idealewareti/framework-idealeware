import { Component, OnInit } from '@angular/core';
import { Meta, Title, SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { StoreService } from './services/store.service';
import { Globals } from './models/globals';
import { Store } from './models/store/store';
import { Router } from '@angular/router';
import { Cart } from './models/cart/cart';

@Component({
  selector: 'app-root',
  templateUrl: './template/app.html',
  styles: []
})
export class AppComponent implements OnInit {  
  
  /*
  Members
  *********************************************************************************************************
  */
  private path: string;
  mediaPath: string;
  facebookSafeUrl: SafeResourceUrl;
  q: string;
  /*
  Constructor
  *********************************************************************************************************
  */
  constructor(
    private service: StoreService,
    private title: Title,
    private meta: Meta,
    private globals: Globals,
    private router: Router,
    private sanitizer: DomSanitizer,
  ){
    this.globals = new Globals();
    this.globals.store = new Store();
    this.globals.cart = new Cart();
  }
  
  /*
  Lifecycle
  *********************************************************************************************************
  */
  ngOnInit() {
    this.service.getStore()
    .then(store => {
      this.globals.store = store;
      this.title.setTitle(store.companyName);
      this.mediaPath = `${this.globals.store.link}/static`;
    })
    .catch(error => {
      console.log(error);
    });
  }

  ngAfterContentChecked() {
    this.getUrl();
  }

  /*
  Getters
  *********************************************************************************************************
  */
  /**
   * Retorna a loja
   * @returns {Store} 
   * @memberof AppComponent
   */
  getStore(): Store {
    if(this.globals.store && this.globals.store.domain)
      return this.globals.store;
    else return null;
  }

  /**
   * Retorna a URL da rota
   * @private
   * @memberof AppComponent
   */
  private getUrl() {
    this.router.events.subscribe((url: any) => this.path = url['url']);
  }

  /*
  Validators
  *********************************************************************************************************
  */
  /**
   * Valida se a página atual é checkout
   * @returns {boolean} 
   * @memberof AppComponent
   */
  isCheckout(): boolean {
    if (!this.path) {
      return false;
    }
    else if (this.path.split('/')[1] == 'checkout') {
      return true;
    } 
    else if (this.path.split('/')[1] == 'orcamento') {
      return true;
    } 
    else return false;
  }

  /**
   * Valida se o cliente está logado
   * @returns 
   * @memberof AppComponent
   */
  isLoggedIn() {
    return false;
  }

  /*
  Actions
  *********************************************************************************************************
  */
  searchFor(event){
  }

}
