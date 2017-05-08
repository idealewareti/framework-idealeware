import { Component, OnInit, AfterViewChecked } from "@angular/core";
import { PopUp } from "../_models/popup/popup";
import { PopUpService } from "../_services/pop-up.service";
import { AppSettings } from "../app.settings";

@Component({
    moduleId: module.id,
    selector: 'popup',
    templateUrl: '/views/popup.component.html'
})
export class PopUpComponent implements OnInit {
    popUpAssortment: PopUp = null;
    public readonly mediaPath = AppSettings.MEDIA_PATH + "/popups/";
    private popupEnabled: boolean = false;
    
    constructor(
        private service: PopUpService,
    ) { }

    ngOnInit() {
        this.getPopUp();
    }

    getPopUp() {
        this.service.getPopUp()
            .then(response => {
                this.popUpAssortment = response;
            })
            .catch(error => console.log(error));
    }


    ngAfterViewChecked() {
        if(!this.popupEnabled){
            this.showPopupModal();
        }
    }

    showPopupModal() {
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