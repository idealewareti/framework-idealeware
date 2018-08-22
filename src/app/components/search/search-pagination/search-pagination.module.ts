import { NgModule } from '@angular/core';
import { SearchPaginationComponent }  from './search-pagination.component';
import { CommonModule } from "@angular/common";

@NgModule({
    declarations: [ SearchPaginationComponent ],
    imports: [ CommonModule ],
    exports: [ SearchPaginationComponent ]
})
export class SearchPaginationModule {}