import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { FormHelper } from "app/helpers/formhelper";
import { Contact } from "app/models/contact/contact";
import { AppSettings } from "app/app.settings";
import { Title } from "@angular/platform-browser";
import { ContactService } from "app/services/contact.service";

declare var swal: any;

@Component({
    moduleId: module.id,
    selector: 'contact',
    templateUrl: '../../views/contact.component.html',
})
export class ContactComponent implements OnInit {
    contactForm: FormGroup;
    contact: Contact;
    messageSent: boolean = false;

    constructor(
        formBuilder: FormBuilder,
        private formHelper: FormHelper,
        private titleService: Title,
        private service: ContactService,
    ) {
        this.contactForm = formBuilder.group({
            name: ['', Validators.required],
            email: ['', Validators.required],
            title: ['', Validators.required],
            message: ['', Validators.required]
        });

        this.contact = new Contact();
     }

    ngOnInit() {}

    submit(event){
        event.preventDefault();

        if(this.contactForm.invalid){
            for(let i in this.contactForm.controls){
                (<any>this.contactForm.controls[i])._touched = true;
            }

            swal({
                title: 'Falha ao enviar a mensagem',
                text: 'Os campos informados com * são obrigatórios',
                type: "error",
                confirmButtonText: "OK"
            });
        }
        else{
            this.service.sendContact(this.contact)
            .then(contact => {
                this.messageSent = true;
                swal({
                    title: 'Mensagem Enviada',
                    text: 'Sua mensagem foi enviada com sucesso!',
                    type: "success",
                    confirmButtonText: "OK"
                });  
            })
            .catch(error => {

                let message = '';
                if(error.status === 500)
                    message = 'Falha no servidor'
                else message = error.text();

                swal({
                    title: 'Falha ao enviar a mensagem',
                    text: message,
                    type: "error",
                    confirmButtonText: "OK"
                });
            });
        }
    }

    hasError(key: string): boolean{
        return (this.contactForm.controls[key].touched && this.contactForm.controls[key].invalid);
    }
}