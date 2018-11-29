import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CampaignComponent } from './campaign.component';

@NgModule({
    declarations: [CampaignComponent],
    imports: [CommonModule],
    exports: [CampaignComponent]
})
export class CampaignModule { }