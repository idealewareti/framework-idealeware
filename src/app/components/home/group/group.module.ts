import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GroupComponent } from './group.component';
import { RouterModule } from '@angular/router';

@NgModule({
    declarations: [ GroupComponent ],
    imports: [ CommonModule, RouterModule ],
    exports: [ GroupComponent ],
    providers: [],
})
export class GroupModule {}