export class HistoryStatus{
      status: number;
      alterDate: Date;
      description: string;
    
    constructor(object = null){
        if(object) return this.createFromResponse(object);
    }

    public createFromResponse(response): HistoryStatus{
        let model = new HistoryStatus();
        
        for (var k in response){
            model[k] = response[k];
        }

        return model;
            
    }
    
}