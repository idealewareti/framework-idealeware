import { BrowserModule } from '@angular/platform-browser';
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
			'api-pub-customer.prd.idealeware.com.br',
			'api-pub-order.prd.idealeware.com.br',
			'api-pub-cart.prd.idealeware.com.br',
			'api-pub-payments.prd.idealeware.com.br',
			'api-pub-budget.prd.idealeware.com.br',
			'api-pub-authenticate.prd.idealeware.com.br',
			'api-pub-productrating.prd.idealeware.com.br'
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
		GlobalErrorModule
	],
	providers: [
		{ provide: LOCALE_ID, useValue: "pt_BR" }
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
