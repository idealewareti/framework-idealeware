import { Component, OnInit, Input, Inject, PLATFORM_ID } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NewsLetter } from '../../../models/newsletter/newsletter';
import { NewsLetterService } from '../../../services/newsletter.service';
import { validEmail } from '../../../directives/email-validator/email-validator.directive';
import { isPlatformBrowser } from '@angular/common';

declare var swal: any;

@Component({
    moduleId: module.id,
    selector: 'app-newsletter',
    templateUrl: '../../../template/home/newsletter/newsletter.html',
    styleUrls: ['../../../template/home/newsletter/newsletter.scss']
})
export class NewsLetterComponent implements OnInit {
    @Input() popupId: string = null;
    newsletter: NewsLetter = new NewsLetter();
    newsletterForm: FormGroup;

    constructor(private service: NewsLetterService, formBuilder: FormBuilder, @Inject(PLATFORM_ID) private platformId: Object) {
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
                if(this.newsletterForm.controls['name'].invalid) {
                    swal('Erro', 'Informe o nome', 'error');
                    return;
                }
                if(this.newsletterForm.controls['email'].invalid) {
                    swal('Erro', 'Informe corretamente o e-mail', 'error');
                    return;
                }
                return;
            }
            else {
                this.service.createNewsLetter(this.newsletter, this.popupId)
                    .subscribe(newsletter => {
                        swal('Newsletter cadastrado', 'E-mail cadastrado com sucesso.', 'success');
                        this.newsletter = new NewsLetter();
                    }, error => {
                        swal('Erro ao cadastrar email', error.text(), 'error');
                        console.log(error);
                    });
            }
        }
    }


    hasError(key: string): boolean {
        let error: boolean = (this.newsletterForm.controls[key].touched && this.newsletterForm.controls[key].invalid);
        return error;
    }

}