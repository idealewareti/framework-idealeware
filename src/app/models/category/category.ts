export class Category {
    id: string;
    code: string;
    name: string;
    position: number;
    level: number;
    picture: string;
    parentCategoryId: string;
    parentCategory: Category;
    status: boolean;
    metaTagTitle: string;
    metaTagDescription: string;
    children: Category[];
    quantity: number;
}