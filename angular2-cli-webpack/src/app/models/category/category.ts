declare var S: any;

export class Category{
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
  children: Category[] = [];
  niceName: string;

    constructor(objectResponse = null){
        if(objectResponse)
            return this.createFromResponse(objectResponse);
    }

    public createFromResponse(response): Category{
        let category = new Category();
        
        for (var k in response){
            if(k == 'parentCategory'){
                category.parentCategory = new Category(response[k]);
            }
            else if(k == 'children'){
                category.children = response[k].map(c => c = new Category(c));
            }
            else{
                category[k] = response[k];
            }
            
        }
        
        category.niceName = S(category.name.toLowerCase().replace(/ /g, '-')).latinise().s;

        return category;
    }

}