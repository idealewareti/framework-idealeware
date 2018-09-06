import { Component, OnInit, Inject, PLATFORM_ID, Input } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
import { PopUp } from "../../../models/popup/popup";
import { Store } from "../../../models/store/store";
import { PopUpManager } from "../../../managers/pop-up.manager";
import { CookieService } from "ngx-cookie-service";

declare var $: any;

@Component({
    selector: 'popup',
    templateUrl: '../../../templates/home/pop-up/popup.html',
    styleUrls: ['../../../templates/home/pop-up/popup.scss']
})
export class PopUpComponent implements OnInit {
    popUpAssortment: PopUp = null;
    private popupEnabled: boolean = false;
    @Input() store: Store;

    constructor(
        private cookie: CookieService,
        private manager: PopUpManager,
        @Inject(PLATFORM_ID) private platformId: Object
    ) { }

    ngOnInit() {
        if (isPlatformBrowser(this.platformId)) {
            this.loadPopUp();
        }
    }

    getPopUpPicture(): string {
        if (isPlatformBrowser(this.platformId)) {
            return `${this.store.link}/static/popups/${this.popUpAssortment.picture}`;
        }
    }

    loadPopUp() {
        if (isPlatformBrowser(this.platformId)) {
            this.manager.getPopUp()
                .subscribe(response => {
                    this.initData(response);
                });
        }
    }

    ngAfterViewChecked() {
        if (isPlatformBrowser(this.platformId)) {
            if (!this.popupEnabled) {
                this.showPopupModal();
            }
        }
    }

    showPopupModal() {
        if (isPlatformBrowser(this.platformId)) {
            if (this.popUpAssortment != null && !this.cookie.check('popup')) {
                let self = this;
                this.popupEnabled = true;
                $('#popUpModal').fadeIn(function () {
                    let expiredDate = new Date();
                    expiredDate.setDate(expiredDate.getDate() + 1);
                    self.cookie.set('popup', 'true', expiredDate);
                    $(document).on('click', '#popUpModal .btn-close-clickview, #popUpModal .mask', function () {
                        $('#popUpModal').fadeOut();
                    });
                });
            }
        }
    }

    private initData(data: PopUp): void {
        if (isPlatformBrowser(this.platformId)) {
            if (data && data.id) {
                this.popUpAssortment = data;
            }
            else {
                this.popUpAssortment = null;
            }
        }
    }
}