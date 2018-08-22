import { Component, Inject, PLATFORM_ID, Renderer2, ViewChild, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Login } from '../../../models/customer/login';
import { CartManager } from "../../../managers/cart.manager";
import { CustomerManager } from "../../../managers/customer.manager";
import { isPlatformBrowser } from '@angular/common';
import { AppConfig } from '../../../app.config';
import { SeoManager } from '../../../managers/seo.manager';

declare var swal: any;
declare var toastr: any;

@Component({
    selector: 'login',
    templateUrl: '../../../templates/register/login/login.html',
    styleUrls: ['../../../templates/register/login/login.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
    private step: string = '';
    login: Login;
    formLogin: FormGroup;
    @ViewChild('scriptContainer') scriptContainer: ElementRef;
    kondutoScript: HTMLElement;
    kondutoScriptId = 'konduto-event-script';

    constructor(
        private route: ActivatedRoute,
        private parentRouter: Router,
        private customerManager: CustomerManager,
        private seoManager: SeoManager,
        private renderer: Renderer2,
        builder: FormBuilder,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {
        this.login = new Login();
        this.formLogin = builder.group({
            cpfEmail: ['', Validators.required],
            password: ['', Validators.required]
        });
    }

    ngOnInit() {
        this.step = this.route.queryParams['value'].step;
        if (this.isNewCustomer())
            this.parentRouter.navigateByUrl('/cadastro');

        this.seoManager.setTags({
            title: 'Login',
            description: 'Login',
        });
    }

    ngOnDestroy() {
        if (isPlatformBrowser(this.platformId)) {
            let script = document.getElementById(this.kondutoScriptId);
            if (script) {
                this.renderer.removeChild(this.scriptContainer, this.kondutoScript);
            }
        }
    }

    isNewCustomer() {
        if (this.step == 'cadastro') return true;
        else return false;
    }

    submit(event) {
        event.preventDefault();
        this.signIn();
    }

    signIn() {
        this.login = this.formLogin.getRawValue();
        this.customerManager.signIn(this.login)
            .subscribe(customer => {
                toastr['success'](`Bem-${customer.gender == 'F' ? 'vinda' : 'vindo'}, ${customer.firstname_Companyname}`);
                this.injectKondutoIdentifier(this.login.cpfEmail);

                if (this.step)
                    this.parentRouter.navigateByUrl(this.step);
                else
                    this.parentRouter.navigateByUrl('/');

            }, err => {
                if (isPlatformBrowser(this.platformId)) {
                    swal('Não foi possível acessar sua conta', err.error, 'error');
                }
            });
    }

    private injectKondutoIdentifier(id: string): void {
        if (!this.isKondutoActived()) {
            return;
        }

        let script = this.renderer.createElement('script');
        this.renderer.setAttribute(script, 'id', this.kondutoScriptId);
        const content = `
            var customerID = "${id}"; // define o ID do cliente 
            (function () {
                var period = 300;
                var limit = 20 * 1e3;
                var nTry = 0;
                var intervalID = setInterval(function () { // loop para retentar o envio         
                    var clear = limit / period <= ++nTry;
                    if ((typeof (Konduto) !== "undefined") &&
                        (typeof (Konduto.setCustomerID) !== "undefined")) {
                        window.Konduto.setCustomerID(customerID); // envia o ID para a Konduto             
                        clear = true;
                    }
                    if (clear) {
                        clearInterval(intervalID);
                    }
                }, period);
            })(customerID);
        `

        script.innerHTML = content;
        this.renderer.appendChild(this.scriptContainer.nativeElement, script);
    }

    private isKondutoActived(): boolean {
        return AppConfig.KONDUTO;
    }
}