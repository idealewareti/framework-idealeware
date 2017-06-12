import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { CustomerService } from "app/services/customer.service";
import { Login } from "app/models/customer/login";
import { FormGroup } from "@angular/forms";
import { Customer } from "app/models/customer/customer";

declare var $: any;

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
    
    constructor(private service: CustomerService) { }

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
        this.service.login(this.login.cpfEmail, this.login.password)
            .then((manager) => {
                return this.service.getUser();
            })
            .then(customer => {
                this.close();
                this.isLogged.emit(customer);
            })
            .catch(error => {})
    }
}