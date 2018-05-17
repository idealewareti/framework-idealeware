import { EnumBannerType } from "../../enums/banner-type.enum";

export class ShowCaseBanner {
    name: string;
    fullBanner: string;
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