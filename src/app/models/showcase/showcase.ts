import { Product } from '../product/product'
import { ShowCaseBanner } from './showcase-banner';
import { ShowcaseGroup } from './showcase-group';

export class ShowCase {
    name: string;
    banners: ShowCaseBanner[] = [];
    metaTagTitle: string;
    metaTagDescription: string;
}