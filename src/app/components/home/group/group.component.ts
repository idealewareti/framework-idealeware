import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { Group } from '../../../models/group/group';
import { AppCore } from '../../../app.core';
import { GroupService } from '../../../services/group.service';

@Component({
    selector: 'app-group',
    templateUrl: '../../../template/home/group/group.html',
    styleUrls: ['../../../template/home/group/group.scss']
})
export class GroupComponent implements OnInit {

    groups: Group[] = [];

    constructor(
        private service: GroupService,
        @Inject(PLATFORM_ID) private platformId: Object
    ) { }

    ngOnInit() {
        this.getGroups();
    }

    getGroups() {
        this.service.getAll()
            .subscribe(groups => {
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