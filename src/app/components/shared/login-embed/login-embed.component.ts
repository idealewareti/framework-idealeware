import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter, PLATFORM_ID, Inject } from '@angular/core';
import { Login } from "../../../models/customer/login";
import { FormGroup } from "@angular/forms";
import { Customer } from "../../../models/customer/customer";
import { CustomerManager } from "../../../managers/customer.manager";
import { isPlatformBrowser } from '@angular/common';

declare var $: any;
declare var swal: any;

@Component({
    moduleId: module.id,
    selector: 'app-login-embed',
    templateUrl: '../../../template/shared/login-embed/login-embed.html',
    styleUrls: ['../../../template/shared/login-embed/login-embed.scss']
})
export class LoginEmbedComponent implements OnInit, OnChanges {

    @Input() step: string = '';
    @Input() openModal: boolean = false;
    @Output() modalIsOpened: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() isLogged: EventEmitter<Customer> = new EventEmitter<Customer>();

    login: Login = new Login(null, null);
    formLogin: FormGroup;

    constructor(private manager: CustomerManager,
        @Inject(PLATFORM_ID) private platformId: Object) { }

    ngOnInit() { }

    ngOnChanges(changes: SimpleChanges): void {
        if (isPlatformBrowser(this.platformId)) {
            if (changes['openModal'].currentValue) {
                this.open();
            }
        }
    }

    open() {
        this.modalIsOpened.emit(false);
        $('#login').fadeIn(function () {
            $(document).on('click', '#login .mask, #login .btn-close-clickview', function () {
                $('#login').fadeOut();
            });
        });
    }

    close() {
        $('#login').fadeOut();
    }

    submitLogin(event) {
        if (isPlatformBrowser(this.platformId)) {
            event.preventDefault();
            this.manager.signIn(new Login(this.login.cpfEmail, this.login.password))
                .then(() => {
                    return this.manager.getUser();
                })
                .then(customer => {
                    this.close();
                    this.isLogged.subscribe(customer);
                })
                .catch(error => {
                    this.close();
                    swal('Erro', 'Usuário ou senha inválido', 'error');
                })
        }
    }
}