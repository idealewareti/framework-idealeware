import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { SearchPaginationComponent }  from './search-pagination.component';

@NgModule({
    declarations: [ SearchPaginationComponent ],
    imports: [ BrowserModule ],
    providers: [],
    exports: [ SearchPaginationComponent ]
})
export class SearchPaginationModule {}