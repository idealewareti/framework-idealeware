import { Component, OnInit, Input, Inject, PLATFORM_ID } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NewsLetter } from '../../../models/newsletter/newsletter';
import { validEmail } from '../../../directives/email-validator/email-validator.directive';
import { isPlatformBrowser } from '@angular/common';
import { NewsLetterManager } from '../../../managers/newsletter.manager';

declare var swal: any;

@Component({
    selector: 'popup-newsletter',
    templateUrl: '../../../templates/home/popup-newsletter/popup-newsletter.html',
    styleUrls: ['../../../templates/home/popup-newsletter/popup-newsletter.scss']
})
export class PopUpNewsLetterComponent implements OnInit {
    @Input() popupId: string = null;
    newsletter: NewsLetter = new NewsLetter();
    newsletterForm: FormGroup;

    constructor(private manager: NewsLetterManager, formBuilder: FormBuilder, @Inject(PLATFORM_ID) private platformId: Object) {
        this.newsletterForm = new FormBuilder().group({
            name: ['', Validators.required],
            email: ['', Validators.compose([
                Validators.required,
                validEmail()
            ])],
        });
    }

    ngOnInit() { }

    signupNewsLetter(event) {
        event.preventDefault();
        if (isPlatformBrowser(this.platformId)) {
            if (this.newsletterForm.invalid) {
                for (let i in this.newsletterForm.controls) {
                    (<any>this.newsletterForm.controls[i])._touched = true;
                }
                if (this.newsletterForm.controls['name'].invalid) {
                    swal('Erro', 'Informe o nome', 'error');
                    return;
                }
                if (this.newsletterForm.controls['email'].invalid) {
                    swal('Erro', 'Informe corretamente o e-mail', 'error');
                    return;
                }
                return;
            }
            else {
                this.manager.createNewsLetter(this.newsletter, this.popupId)
                    .subscribe(() => {
                        swal('Newsletter cadastrado', 'E-mail cadastrado com sucesso.', 'success');
                        this.newsletter = new NewsLetter();
                    }, err => {
                        swal('Erro ao cadastrar email', err.error, 'error');
                    });
            }
        }
    }


    hasError(key: string): boolean {
        let error: boolean = (this.newsletterForm.controls[key].touched && this.newsletterForm.controls[key].invalid);
        return error;
    }

}