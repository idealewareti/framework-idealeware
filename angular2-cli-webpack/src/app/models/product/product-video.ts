export class ProductVideo {
    videoUrl: string;
    videoEmbed: string;

    constructor(video = null) {
        if (video)
            return this.createFromObject(video);
    }

    private createFromObject(object): ProductVideo {
        let video = new ProductVideo();

        for (var k in object) {
            video[k] = object[k];
        }

        return video;
    }
}