import { Product } from '../product/product'
import { ShowCaseBanner } from './showcase-banner';
import { ShowcaseGroup } from './showcase-group';

export class ShowCase {
    name: string;
    banners: ShowCaseBanner[] = [];
    groups: ShowcaseGroup[] = [];
    metaTagTitle: string;
    metaTagDescription: string;
}