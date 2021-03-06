import { IntelipostIdentification } from '../intelipost/intelipost-identification';
import { Sku } from './sku';

export class ProductShippingModel {
    Identification: IntelipostIdentification;
    ZipCode: string;
    Products: Sku;
}