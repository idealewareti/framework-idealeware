import { Input, Component, AfterViewChecked, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { RouterModule } from '@angular/router';
import { FormGroup, FormBuilder, Validators, Form } from '@angular/forms';
import { AppSettings } from 'app/app.settings';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';

import { Login } from 'app/models/customer/login';
import { CartService } from "app/services/cart.service";
import { CartManager } from "app/managers/cart.manager";
import { CustomerManager } from "app/managers/customer.manager";

//declare var $: any;
declare var S: any;
declare var swal: any;
declare var toastr: any;

@Component({
    moduleId: module.id,
    selector: 'login',
    templateUrl: '../../views/login.component.html',
})
export class LoginComponent {
    private step: string = '';
    login: Login;
    formLogin: FormGroup;

    constructor(
        private titleService: Title,
        private route: ActivatedRoute,
        private parentRouter: Router,
        private manager: CustomerManager,
        private cartService: CartService,
        private cartManager: CartManager,
        builder: FormBuilder,
    ) {
        window.scrollTo(0, 0); // por causa das hash url
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
        else AppSettings.setTitle('Login', this.titleService);

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
            this.route.params
            .map(params => params)
            .subscribe((params) => {
                let step = ((params['step']) ? params['step'] : '');

                if (step == 'checkout') {
                    this.parentRouter.navigateByUrl(`/checkout`);
                }
                else {
                    this.cartManager.getCart()
                    .then(response => {
                        if (response.products.length > 0)
                            this.parentRouter.navigateByUrl(`/carrinho`);
                        else
                            this.parentRouter.navigateByUrl(`/`);
                    })
                    .catch(error => {
                        this.parentRouter.navigateByUrl(`/`);
                    });
                }
            });
        })
        .catch(error => {
            swal({
                title: 'Não foi possível acessar sua conta',
                text: error.text(),
                type: "error",
                confirmButtonText: "OK"
            });
        });;
    }
}