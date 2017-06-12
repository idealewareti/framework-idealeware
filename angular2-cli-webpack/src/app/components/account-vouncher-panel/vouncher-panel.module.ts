import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { VouncherPanelComponent }  from './vouncher-panel.component';

@NgModule({ 
    declarations: [ VouncherPanelComponent ],
    imports: [ BrowserModule ],
    providers: [],
    exports: [ VouncherPanelComponent ]
})
export class VouncherPanelModule {}