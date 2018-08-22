import { ModelReference } from '../model-reference';

export class Banner {
    id: string;
    name: string;
    url: string;
    picture: string;
    place: number;
    startDateTime: Date;
    endDateTime: Date;
    categories: ModelReference[];
    brands: ModelReference[];
    groups: ModelReference[];
    status: boolean;
}

