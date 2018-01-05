import { Product } from '../product/product';

export class Group {
    id: string;
    code: string;
    name: string;
    position: number;
    picture: string;
    metaTagTitle: string;
    metaTagDescription: string;
    products: Product[];
}