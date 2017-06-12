export class Pagination{
    TotalCount: number;
    TotalPages: number;
    PrevPage: number;
    NextPage: number;

     constructor(object = null){
        if(object) return this.createFromResponse(object);
    }

    public createFromResponse(response): Pagination{
        let model = new Pagination();
        
        for (var k in response){
            model[k] = response[k];
        }

        return model;
    }
}