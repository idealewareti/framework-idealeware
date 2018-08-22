import { Meta, Title } from "@angular/platform-browser";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class SeoManager {

    constructor(
        private title: Title,
        private meta: Meta
    ) { }

    setTags(tags) {
        this.removeAllTags();

        this.title.setTitle(tags.title);

        this.meta.updateTag({ name: 'title', content: tags.title });
        this.meta.updateTag({ name: 'description', content: tags.description || tags.title });

        this.meta.updateTag({ property: 'og:title', content: tags.title });
        this.meta.updateTag({ property: 'og:description', content: tags.description || tags.title });

        if (tags.image) {
            this.meta.updateTag({ property: 'og:image', content: tags.image });
        }
    }

    private removeAllTags() {
        this.meta.removeTag('title');
        this.meta.removeTag('description');

        this.meta.removeTag("property='og:title'");
        this.meta.removeTag("property='og:description'");
        this.meta.removeTag("property='og:image'");
    }
}