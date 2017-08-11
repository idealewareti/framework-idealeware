import { EnumBannerType } from "app/enums/banner-type.enum";

export class ShowCaseBanner {
    id: string;
    showCaseId: string;
    name: string;
    fullBanner: string;
    position: number;
    createdDate: Date;
    url: string;
    bannerType: EnumBannerType = EnumBannerType.Full;

    constructor(response = null){
        if(response) return this.CreateFromResponse(response);
    }

    CreateFromResponse(object): ShowCaseBanner{
        let model = new ShowCaseBanner();

        for(var k in object){
            model[k] = object[k];
        }

        return model;
    }
}