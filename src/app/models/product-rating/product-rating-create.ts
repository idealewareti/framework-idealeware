import { CustomerProductRating } from "./customer-product-rating";

export class ProductRatingCreate {
    id: string;
    name: string;
    customers: CustomerProductRating = new CustomerProductRating();
}