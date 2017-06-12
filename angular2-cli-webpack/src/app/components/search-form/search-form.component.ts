import { Component, OnInit, OnDestroy, AfterContentChecked } from '@angular/core';
import { Router } from "@angular/router";
import { AppSettings } from "app/app.settings";

declare var $: any;

@Component({
    moduleId: module.id,
    selector: 'search-form',
    templateUrl: '../../views/search-form.component.html',
})
export class SearchFormComponent implements OnInit {
    public q: string;
    
    constructor(private parentRouter: Router, ) { }

    ngOnInit() {}

     ngOnDestroy() {}

     ngAfterContentChecked() {
         $('.btn-search').click(function(event) {
			$('#search-box .mask').hide();
			$('#search-box #form-search').css('top', '-100%');
			$('#search-box').show();
			$('#search-box .mask').fadeIn(300);
			$('#search-box #form-search').css('top', 0);
			return false;
		});
		$('#search-box .btn-close,#search-box .mask').click(function(event) {
			$('#search-box #form-search').css('top', '-100%');
			$('#search-box .mask').fadeOut(300, function(){
				$('#search-box').hide();
			});
			
			return false;
		});
     }

    searchFor(event){
        event.preventDefault();
        $('#search-box #form-search').css('top', '-100%');
        $('#search-box .mask').fadeOut(300, function(){
            $('#search-box').hide();
        });
        this.parentRouter.navigate(['/buscar', {'q': this.q}]);

    }

    isMobile(): boolean{
        return AppSettings.isMobile();
    }
}