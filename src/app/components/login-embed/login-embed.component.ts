import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { Login } from "app/models/customer/login";
import { FormGroup } from "@angular/forms";
import { Customer } from "app/models/customer/customer";
import { CustomerManager } from "app/managers/customer.manager";

declare var $: any;
declare var swal: any;

@Component({
    moduleId: module.id,
    selector: 'login-embed',
    templateUrl: '../../views/login-embed.component.html',
})
export class LoginEmbedComponent implements OnInit, OnChanges {

    @Input() step: string = '';
    @Input() openModal: boolean = false;
    @Output() modalIsOpened: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() isLogged: EventEmitter<Customer> = new EventEmitter<Customer>();

    login: Login = new Login(null, null);
    formLogin: FormGroup;
    
    constructor(private manager: CustomerManager) { }

    ngOnInit() { }

    ngOnChanges(changes: SimpleChanges): void {
        if(changes['openModal'].currentValue){
            this.open();
        }
    }
    
    open(){
        this.modalIsOpened.emit(false);
        $('#login').fadeIn(function(){
            $(document).on('click', '#login .mask, #login .btn-close-clickview', function(){
			    $('#login').fadeOut();
		    });
        });
    }

    close(){
        $('#login').fadeOut();
    }

    submitLogin(event){
        event.preventDefault();
        this.manager.signIn(new Login(this.login.cpfEmail, this.login.password))
        .then(() => {
            return this.manager.getUser();
        })
        .then(customer => {
            this.close();
            this.isLogged.emit(customer);
        })
        .catch(error => {
            this.close();
            swal('Erro', 'Usuário ou senha inválido', 'error');
        })
    }
}