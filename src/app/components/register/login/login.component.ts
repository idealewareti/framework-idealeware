import { Input, Component, AfterViewChecked, OnInit, Inject, PLATFORM_ID, Renderer2, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Http } from '@angular/http';
import { RouterModule } from '@angular/router';
import { FormGroup, FormBuilder, Validators, Form } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Login } from '../../../models/customer/login';
import { CartManager } from "../../../managers/cart.manager";
import { CustomerManager } from "../../../managers/customer.manager";
import { isPlatformBrowser } from '@angular/common';
import { AppConfig } from '../../../app.config';

//declare var $: any;
declare var S: any;
declare var swal: any;
declare var toastr: any;

@Component({
    moduleId: module.id,
    selector: 'app-login',
    templateUrl: '../../../template/register/login/login.html',
    styleUrls: ['../../../template/register/login/login.scss']

})
export class LoginComponent implements OnDestroy {
    private step: string = '';
    login: Login;
    formLogin: FormGroup;
    @ViewChild('scriptContainer') scriptContainer: ElementRef;
    kondutoScript: HTMLElement;
    kondutoScriptId = 'konduto-event-script';

    constructor(
        private titleService: Title,
        private route: ActivatedRoute,
        private parentRouter: Router,
        private manager: CustomerManager,
        private cartManager: CartManager,
        private renderer: Renderer2,
        builder: FormBuilder,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {
        this.login = new Login('', '');
        this.formLogin = builder.group({
            cpfEmail: ['', Validators.required],
            password: ['', Validators.required]
        });
    }

    ngOnInit() {
        this.step = this.route.params['value'].step;
        if (this.isNewCustomer())
            this.parentRouter.navigateByUrl('/cadastro');
        else this.titleService.setTitle('Login');

    }

    ngOnDestroy() {
        let script = document.getElementById(this.kondutoScriptId);
        if (script) {
            this.renderer.removeChild(this.scriptContainer, this.kondutoScript);
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
        this.manager.signIn(this.login)
            .then(customer => {
                toastr['success'](`Bem-${customer.gender == 'F' ? 'vinda' : 'vindo'}, ${customer.firstname_Companyname}`);
                this.injectKondutoIdentifier(this.login.cpfEmail);
                this.route.params
                    .map(params => params)
                    .subscribe((params) => {
                        let step = ((params['step']) ? params['step'] : '');

                        if (step == 'checkout') {
                            this.parentRouter.navigateByUrl(`/checkout`);
                        }
                        else {
                            if (isPlatformBrowser(this.platformId)) {
                                this.cartManager.getCart(localStorage.getItem('cart_id'))
                                    .then(response => {
                                        if (response.products.length > 0) {
                                            this.parentRouter.navigateByUrl(`/carrinho`);
                                        }
                                        else {
                                            this.parentRouter.navigateByUrl(`/`);
                                        }
                                    })
                                    .catch(error => {
                                        console.log(error);
                                        this.parentRouter.navigateByUrl(`/`);
                                    });
                            }
                        }
                    });
            })
            .catch(error => {
                console.log(error);
                if (isPlatformBrowser(this.platformId)) {
                    swal('Não foi possível acessar sua conta', error.text(), 'error');
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