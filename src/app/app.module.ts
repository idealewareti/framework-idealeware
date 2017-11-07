import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import 'rxjs/add/operator/map';


import { AppComponent } from './app.component';

/* Home */
import { ShowcaseComponent } from './components/home/showcase/showcase.component';
import { CategoryMenuModule } from './components/home/category-menu/category-menu.module';
/* Search */
/* Product */
/* Cart */
/* Checkout */
/* Custom Paint */
/* Account */
/* Shared */

/* Services */
import { HttpClientHelper } from './helpers/http.helper';
import { StoreService } from './services/store.service';
import { Globals } from './models/globals';
import { ShowcaseService } from './services/showcase.service';
import { CategoryService } from './services/category.service';


@NgModule({
  declarations: [
    AppComponent,
    ShowcaseComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({appId: 'idealecommerce-app'}),
    RouterModule.forRoot([
      { path: '', component: ShowcaseComponent, pathMatch: 'full'},
    ]),
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    CategoryMenuModule,
  ],
  providers: [
    HttpClientHelper,
    Globals,
    CategoryService,
    ShowcaseService,
    StoreService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
