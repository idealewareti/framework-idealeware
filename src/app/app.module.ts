import { BrowserModule } from '@angular/platform-browser';
import { PrebootModule } from 'preboot';
import { NgModule, PLATFORM_ID, LOCALE_ID } from '@angular/core';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { TransferHttpCacheModule } from '@nguniversal/common';
import { JwtModule, JWT_OPTIONS } from '@auth0/angular-jwt';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { isPlatformBrowser, registerLocaleData } from '@angular/common';
import { CategoryComponent } from './components/home/category/category.component';
import { AppConfig } from './app.config';
import { NewsLetterComponent } from './components/home/newsletter/newsletter.component';
import { MiniCartModule } from './components/home/mini-cart/mini-cart.module';
import ptBr from '@angular/common/locales/pt';
import { AppRoutingModule } from './app.routing.module';
import { GroupComponent } from './components/home/group/group.component';
import { PopUpModule } from './components/home/pop-up/popup.module';
import { GlobalErrorModule } from './error/global-error.module';
import { RegisterModule } from './components/register/register.module';
import { environment } from '../environments/environment';

registerLocaleData(ptBr)

export function jwtOptionsFactory(platformId) {
	return {
		tokenGetter: () => {
			let token = null;
			if (isPlatformBrowser(platformId)) {
				token = localStorage.getItem('auth');
			}
			return token;
		},
		whitelistedDomains: [
			environment.API_CUSTOMER,
			environment.API_ORDER,
			environment.API_CART,
			environment.API_PAYMENTS,
			environment.API_BUDGET,
			environment.API_AUTHENTICATE,
			environment.API_PRODUCTRATING
		],
	};
}

@NgModule({
	declarations: [
		AppComponent,
		CategoryComponent,
		GroupComponent,
		NewsLetterComponent
	],
	imports: [
		BrowserModule.withServerTransition({ appId: `${AppConfig.DOMAIN}-app` }),
		PrebootModule.withConfig({ appRoot: 'app-root', replay: false }),
		AppRoutingModule,
		HttpClientModule,
		TransferHttpCacheModule,
		JwtModule.forRoot({
			jwtOptionsProvider: {
				provide: JWT_OPTIONS,
				useFactory: jwtOptionsFactory,
				deps: [PLATFORM_ID]
			}
		}),
		FormsModule,
		ReactiveFormsModule,
		MiniCartModule,
		PopUpModule,
		GlobalErrorModule,
		RegisterModule
	],
	providers: [
		{ provide: LOCALE_ID, useValue: "pt_BR" }
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
