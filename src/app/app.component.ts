import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { StoreService } from './services/store.service.';
import { Globals } from './models/globals';
import { Store } from './models/store/store';
import { Router } from '@angular/router';

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

  constructor(
    private service: StoreService,
    private title: Title,
    private meta: Meta,
    private globals: Globals,
    private router: Router,
  ){
    this.globals = new Globals();
  }

  ngOnInit() {
    this.service.getStore()
    .then(store => {
      this.globals.store = store;
      this.title.setTitle(store.companyName);
    })
    .catch(error => {
      console.log(error);
    });
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
    return this.globals.store;
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
    if (!this.path) return false
    else if (this.path.split('/')[1] == 'checkout') return true;
    else if (this.path.split('/')[1] == 'orcamento') return true;
    else return false;
}

}
