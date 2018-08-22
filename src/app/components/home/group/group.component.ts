import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Group } from '../../../models/group/group';
import { AppCore } from '../../../app.core';
import { GroupManager } from '../../../managers/group.manager';

@Component({
    selector: 'group',
    templateUrl: '../../../templates/home/group/group.html',
    styleUrls: ['../../../templates/home/group/group.scss']
})
export class GroupComponent implements OnInit {

    groups: Group[] = [];

    constructor(
        private manager: GroupManager,
        @Inject(PLATFORM_ID) private platformId: Object,
    ) { }

    ngOnInit() {
        this.manager.getAll()
            .subscribe(groups => {
                this.groups = groups;
            });
    }

    isMobile(): boolean {
        if (isPlatformBrowser(this.platformId)) {
            return AppCore.isMobile(window);
        }
        else return false;
    }

    getRoute(group: Group): string {
        return `/grupo/${AppCore.getNiceName(group.name)}-${group.id}`;
    }
}