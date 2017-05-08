import {Sku} from './sku';
import {ProductPicture} from './product-picture';
import {Category} from '../category/category';
import {Service} from '../product-service/product-service';
import { AppSettings } from '../../app.settings';
import { Brand } from "../brand/brand";
import { TechnicalInformation } from "./product-technical-information";

declare var S: any;

export class Product {
    id: string;
    baseCategory: Category;
    name: string;
    niceName: string;
    urlTo: string;
    description: string;
    briefDescription: string;
    technicalInformation: TechnicalInformation[] = [];
    brand: Brand;
    installmentLimit: number;
    videos: Object[] = [];
    plusFreight: number;
    daysProcessing: number;
    file: string;
    metaTagTitle: string;
    metaTagDescription: string;
    skuBase: Sku;
    skus: Sku[] = [];
    categories: Category[] = [];
    shippingCompanies: Object[] = [];
    crossSelling: Object[] = [];
    upSelling: Object[] = [];
    services: Service[] = [];
    pictures: ProductPicture[] = [];
    areaSizer: number;
    lossPercentage: number;
    createdDate: Date;
    status: boolean;
    information: string;
    selfColor: boolean;
    additionalFreightPrice: number;

    constructor(product = null){
        if(product) 
            return this.CreateFromResponse(product);
    }

    getSku(id: string) : Sku{
        return this.skus.filter(sku => sku.id == id)[0];
    }
    
    getSkuImages(skuId) : ProductPicture[]{
        return this.skus.filter(sku => sku.id == skuId)[0].pictures;
    }

    getSkuCoverImage(skuId) : ProductPicture{
        let image = Object.assign(new ProductPicture, this.getSkuImages(skuId).filter(p => p['position'] == 0)[0]);
        return image;
    }
    
    hasCoverImage(skuId): boolean{
        if(this.skus.filter(sku => sku.id == skuId)[0].pictures) return true;
        else return false;
    }

    CreateFromResponse(object){
        let product = new Product();

        for(var k in object){
            if(k == 'baseCategory'){
                product.baseCategory = new Category(object.baseCategory);
            }
            else if(k == 'skus'){
                product.skus = object.skus.map(sku => new Sku(sku));
            }
            else if(k == 'skuBase'){
                product.skuBase = new Sku(object.skuBase);
            }
            else if(k == 'brand'){
                product.brand = new Brand(object.brand);
            }
            else if(k == 'pictures'){
                product.pictures = object.pictures.map(p => p = new ProductPicture(p));
            }
            else if(k == 'categories'){
                product.categories = object.categories.map(c => c = new Category(c));
            }
            else if(k == 'technicalInformation'){
                product.technicalInformation = object.technicalInformation.map(c => c = new TechnicalInformation(c));
            }
            else{
                product[k] = object[k];
            }
        }

        product.niceName = product.createNiceName(product);
  
        return product;
    }

    createNiceName(product: Product){
        return S(product.name.toLowerCase().replace(/ /g, '-').replace(/\//g, '')).latinise().s
    }

    getCoverImage(){
        let image: string;
        if(this.skuBase.picture != null){
            image =  `${AppSettings.MEDIA_PATH}/products/${this.skuBase.picture.showcase}`;
        }
        else{
            image = `${AppSettings.ROOT_PATH}/assets/imagesno-image.jpg`;
        }
        return image;
    }

    CoverImage(): ProductPicture{
        if(this.skuBase.picture){
            return this.skuBase.picture;
        }
        else return null;
    }

    
}