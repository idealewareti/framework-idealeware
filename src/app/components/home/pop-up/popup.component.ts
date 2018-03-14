import { Component, OnInit, AfterContentChecked, Inject, PLATFORM_ID, Input } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
import { PopUp } from "../../../models/popup/popup";
import { PopUpService } from "../../../services/pop-up.service";
import { Globals } from "../../../models/globals";
import { Store } from "../../../models/store/store";
import { makeStateKey, TransferState } from "@angular/platform-browser";

const POPUP_KEY = makeStateKey('popup_key');

declare var $: any;

@Component({
    moduleId: module.id,
    selector: 'app-popup',
    templateUrl: '../../../template/home/pop-up/popup.html',
    styleUrls: ['../../../template/home/pop-up/popup.scss']
})
export class PopUpComponent implements OnInit {
    popUpAssortment: PopUp = null;
    mediaPath: string;
    private popupEnabled: boolean = false;
    @Input() store: Store;

    constructor(
        private service: PopUpService,
        private state: TransferState,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {
    }

    ngOnInit() {
        this.getPopUp();
    }

    ngAfterContentChecked() {
        if (!this.mediaPath && this.store) {
            this.mediaPath = `${this.store.link}/static/popups/`;
        }
    }

    getPopUpPicture(): string {
        return `${this.store.link}/static/popups/${this.popUpAssortment.picture}`;
    }

    getPopUp() {
        const popup = this.state.get(POPUP_KEY, null as any);
        if (popup) {
            this.initData(popup);
            return;
        }

        this.service.getPopUp()
            .subscribe(response => {
                this.state.set(POPUP_KEY, response as any);
                this.initData(response);
            }, error => console.log(error));
    }

    ngAfterViewChecked() {
        if (!this.popupEnabled) {
            this.showPopupModal();
        }
    }

    showPopupModal() {
        if (isPlatformBrowser(this.platformId)) {
            if (this.popUpAssortment != null) {
                this.popupEnabled = true;
                $('#popUpModal').fadeIn(function () {
                    $(document).on('click', '#popUpModal .btn-close-clickview, #popUpModal .mask', function () {
                        $('#popUpModal').fadeOut();
                    });
                });
            }
        }
    }

    private initData(data: PopUp): void {
        if (data && data.id) {
            this.popUpAssortment = data;
        }
        else {
            this.popUpAssortment = null;
        }
    }
}