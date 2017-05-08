import { Component, OnInit, Input } from '@angular/core';
import { NewsLetter } from "../_models/newsLetter/news-letter";
import { NewsLetterService } from "../_services/news-letter.service";
declare var swal:any;

@Component({
    moduleId: module.id,
    selector: 'newsletter',
    templateUrl: '/views/newsletter.component.html'
})
export class NewsLetterComponent implements OnInit {
    newsletter: NewsLetter = new NewsLetter();
    constructor(private service:NewsLetterService) { }
    @Input() popupId:string = null;

    ngOnInit() { }

    signupNewsLetter(event){
        event.preventDefault();
        this.service.createNewsLetter(this.newsletter, this.popupId)
        .then(newsletter => {
            swal({
                    title: 'Newsletter cadastrado',
                    text: 'E-mail cadastrado com sucesso.',
                    type: 'success',
                    confirmButtonText: 'OK'
                });
                this.newsletter = new NewsLetter();
        })
        .catch(error => {
             swal({
                    title: 'Erro ao cadastrar email',
                    text: error._body,
                    type: 'error',
                    confirmButtonText: 'OK'
                });
                console.log(error);
        })
        
    }

}