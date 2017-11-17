import { NgModule } from '@angular/core';
import { VouncherPanelComponent }  from './vouncher-panel.component';
import { CommonModule } from "@angular/common";

@NgModule({
    declarations: [ VouncherPanelComponent ],
    imports: [ CommonModule ],
    providers: [],
    exports: [ VouncherPanelComponent ]
})
export class VouncherPanelModule {}