import { Component, OnInit, Input, OnChanges, OnDestroy } from '@angular/core';

import { Sku } from '../../../models/product/sku';
import { SimpleChanges } from '@angular/core';
import { Store } from '../../../models/store/store';
import { AxisX } from '../../../enums/axis-x.enum';
import { AxisY } from '../../../enums/axis-y.enum';

@Component({
    selector: 'campaign',
    templateUrl: '../../../templates/shared/campaign/campaign.component.html',
    styleUrls: ['../../../templates/shared/campaign/campaign.component.scss']
})
export class CampaignComponent implements OnChanges {
    @Input() sku: Sku;
    @Input() store: Store;
    private tag: string;

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.sku) {
            this.tag = `${this.store.link}/static/campaign/${this.sku.imageTag}`;
        }
    }

    get getTag() {
        return this.tag;
    }

    get axis() {
        let axisX = this.sku.axisX == AxisX.Left ? 'tag-campaign-left' : 'tag-campaign-right';
        let axisY = this.sku.axisY == AxisY.Top ? 'tag-campaign-top' : 'tag-campaign-bottom';
        return `tag-campaign ${axisX} ${axisY}`;
    }

    isCampaign() {
        return this.sku.imageTag != null;
    }


}
