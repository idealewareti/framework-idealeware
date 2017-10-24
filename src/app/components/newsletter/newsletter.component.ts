import { Component, OnInit, Input } from '@angular/core';
import { NewsLetter } from "app/models/newsletter/newsletter";
import { NewsLetterService } from "app/services/newsletter.service";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { validEmail } from 'app/directives/email-validator/email-validator.directive';

declare var swal:any;

@Component({
    moduleId: module.id,
    selector: 'newsletter',
    templateUrl: '../../views/newsletter.component.html'
})
export class NewsLetterComponent implements OnInit {
    @Input() popupId:string = null;
    newsletter: NewsLetter = new NewsLetter();
    newsletterForm: FormGroup;

    constructor(private service: NewsLetterService, formBuilder: FormBuilder) { 
        this.newsletterForm = new FormBuilder().group({
            name: ['', Validators.required],
            email: ['', Validators.compose([
                Validators.required,
                validEmail()
            ])],
        });
    }

    ngOnInit() {}

    signupNewsLetter(event){
        event.preventDefault();

        if(this.newsletterForm.invalid){
            for(let i in this.newsletterForm.controls){
                (<any>this.newsletterForm.controls[i])._touched = true;
            }
            swal('Erro', 'Informe corretamente os campos informados', 'error');
            return;
        }
        else{
            this.service.createNewsLetter(this.newsletter, this.popupId)
            .then(newsletter => {
                swal('Newsletter cadastrado', 'E-mail cadastrado com sucesso.', 'success');
                    this.newsletter = new NewsLetter();
            })
            .catch(error => {
                 swal('Erro ao cadastrar email', error.text(), 'error');
                    console.log(error);
            });
        }
    }


    hasError(key: string): boolean{
        let error: boolean = (this.newsletterForm.controls[key].touched && this.newsletterForm.controls[key].invalid);
        return error;
    }

}