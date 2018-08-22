import { Component, PLATFORM_ID, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Contact } from "../../../models/contact/contact";
import { ContactService } from "../../../services/contact.service";
import { validEmail } from '../../../directives/email-validator/email-validator.directive';
import { isPlatformBrowser } from '@angular/common';

declare var swal: any;

@Component({
    selector: 'contact',
    templateUrl: '../../../templates/institutional/contact/contact.html',
    styleUrls: ['../../../templates/institutional/contact/contact.scss']
})
export class ContactComponent {
    contactForm: FormGroup;
    contact: Contact;
    messageSent: boolean = false;

    constructor(
        formBuilder: FormBuilder,
        private service: ContactService,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {
        this.contactForm = formBuilder.group({
            name: ['', Validators.required],
            email: ['', Validators.compose([
                Validators.required,
                validEmail()
            ])],
            title: ['', Validators.required],
            message: ['', Validators.required]
        });

        this.contact = new Contact();
    }

    submit(event) {
        event.preventDefault();
        if (isPlatformBrowser(this.platformId)) {
            if (this.contactForm.invalid) {
                for (let i in this.contactForm.controls) {
                    (<any>this.contactForm.controls[i])._touched = true;
                }

                swal({
                    title: 'Falha ao enviar a mensagem',
                    text: 'Os campos informados com * são obrigatórios',
                    type: "error",
                    confirmButtonText: "OK"
                });
            }
            else {
                this.service.sendContact(this.contact)
                    .subscribe(() => {
                        this.messageSent = true;

                        swal({
                            title: 'Mensagem Enviada',
                            text: 'Sua mensagem foi enviada com sucesso!',
                            type: "success",
                            confirmButtonText: "OK"
                        });

                    }, error => {
                        let message = '';
                        if (error.status === 500)
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
    }

    hasError(key: string): boolean {
        return (this.contactForm.controls[key].touched && this.contactForm.controls[key].invalid);
    }
}