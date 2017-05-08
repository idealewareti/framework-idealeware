import { OnInit, Component } from "@angular/core";
import { Group } from "../_models/group/group";
import { GroupService } from "../_services/group.service";
import { AppSettings } from "../app.settings";

@Component({
    moduleId: module.id,
    selector: 'group',
    templateUrl: '/views/group.component.html'
})
export class GroupComponent implements OnInit {
    groups: Group[] = [];

    constructor(private service: GroupService) {
        this.getGroup();

     }

    ngOnInit() { }

    getGroup() {
        this.service.getAll()
        .then(groups =>{
            this.groups = groups;
        }).catch(erro => console.log(erro));
    }

      public isMobile(): boolean{
        return AppSettings.isMobile();
    }
}