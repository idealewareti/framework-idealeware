export class NewsLetter{
    email: string;
    name: string;
    
    constructor(object = null){
        if(object) return this.createFromResponse(object);
    }

    public createFromResponse(response): NewsLetter{
        let model = new NewsLetter();
        
        for (var k in response){
            model[k] = response[k];
        }

        return model;
            
    }
    
}