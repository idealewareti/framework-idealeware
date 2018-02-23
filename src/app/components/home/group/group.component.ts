import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { Group } from '../../../models/group/group';
import { AppCore } from '../../../app.core';
import { GroupService } from '../../../services/group.service';
import { makeStateKey, TransferState } from '@angular/platform-browser';

const GROUPS_KEY = makeStateKey('groups_key');

@Component({
    selector: 'app-group',
    templateUrl: '../../../template/home/group/group.html',
    styleUrls: ['../../../template/home/group/group.scss']
})
export class GroupComponent implements OnInit {

    groups: Group[] = [];

    constructor(
        private service: GroupService,
        @Inject(PLATFORM_ID) private platformId: Object,
        private state: TransferState,
    ) { }

    ngOnInit() {
        this.getGroups();
    }

    getGroups() {
        this.groups = this.state.get(GROUPS_KEY, null as any);
        if (this.groups) return;

        this.service.getAll()
            .subscribe(groups => {
                this.state.set(GROUPS_KEY, groups as any);
                this.groups = groups;
            }, erro => console.log(erro));
    }

    isMobile(): boolean {
        if (isPlatformBrowser(this.platformId)) {
            return AppCore.isMobile(window);
        }
        else return false;
    }

    getRoute(group: Group): string {
        return `/grupo/${group.id}/${AppCore.getNiceName(group.name)}`;
    }
}