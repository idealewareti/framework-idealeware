import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { Http } from "@angular/http";

@Component({
    selector: 'redirect',
    template: '<h1>Redirecionando</h1>'
})
export class RedirectComponent implements OnInit {
    path: string;

    constructor(private router: Router, private route: ActivatedRoute, private http: Http) { }

    ngOnInit() { 
        this.route.params
        .map(params => params)
        .subscribe((params) => {
            let path: string = '';

            if(params['redir']){
                path = decodeURI(this.router.url).slice(1).replace('redirect/', '');
            }
            else
                path = decodeURI(this.router.url).slice(1);

            this.redirectTo(path);
        });
    }
    
    redirectTo(path: string){
        this.http.get('/assets/services/routes.json')
        .map(res => res.json())
        .subscribe(routes => {
            let redirect = routes.find(r => r.path == path.replace(/%2F/g, '/'));
            if(redirect)
                this.router.navigateByUrl(redirect.redirectTo);
            else
                this.router.navigateByUrl('/');

        }, error => {
            console.log(error);
            this.router.navigateByUrl('/');
        });
    }
}