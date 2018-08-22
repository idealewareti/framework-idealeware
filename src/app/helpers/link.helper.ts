import { Injectable, RendererFactory2, ViewEncapsulation, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';

@Injectable({
    providedIn: 'root'
})
export class Link {

    constructor(
        private rendererFactory: RendererFactory2,
        @Inject(DOCUMENT) private document
    ) { }

    addTag(tag: LinkDefinition) {

        try {
            const renderer = this.rendererFactory.createRenderer(this.document, {
                id: '-1',
                encapsulation: ViewEncapsulation.None,
                styles: [],
                data: {}
            });

            const link = renderer.createElement('link');
            const head = this.document.head;

            if (head === null) {
                throw new Error('<head> not found within DOCUMENT.');
            }

            Object.keys(tag).forEach((prop: string) => {
                return renderer.setAttribute(link, prop, tag[prop]);
            });

            renderer.appendChild(head, link);

        } catch (e) {
            console.error('Error within link : ', e);
        }
    }

    updateTag(tag: LinkDefinition) {
        try {
            const renderer = this.rendererFactory.createRenderer(this.document, {
                id: '-1',
                encapsulation: ViewEncapsulation.None,
                styles: [],
                data: {}
            });
            const link = this.document.querySelector(this.parseSelector(tag))
            const head = this.document.head;

            if (head === null) {
                throw new Error('<head> not found within DOCUMENT.');
            }

            if (link) {
                Object.keys(tag).forEach((prop: string) => {
                    return renderer.setAttribute(link, prop, tag[prop]);
                });
            } else {
                this.addTag(tag);
            }

        } catch (e) {
            console.error('Error within link : ', e);
        }
    }

    removeTag(tag: LinkDefinition) {
        try {
            const renderer = this.rendererFactory.createRenderer(this.document, {
                id: '-1',
                encapsulation: ViewEncapsulation.None,
                styles: [],
                data: {}
            });
            const link = this.document.querySelector(this.parseSelector(tag))
            const head = this.document.head;

            if (head === null) {
                throw new Error('<head> not found within DOCUMENT.');
            }

            if (link) {
                Object.keys(tag).forEach((prop: string) => {
                    return renderer.removeAttribute(link, prop, tag[prop]);
                });
            }

        } catch (e) {
            console.error('Error within link : ', e);
        }
    }

    private parseSelector(tag: LinkDefinition): string {
        const attr: string = tag.rel ? 'rel' : 'hreflang';
        return `link[${attr}="${tag[attr]}"]`;
    }
}

export declare type LinkDefinition = {
    charset?: string;
    crossorigin?: string;
    href?: string;
    hreflang?: string;
    media?: string;
    rel?: string;
    rev?: string;
    sizes?: string;
    target?: string;
    type?: string;
} & {
    [prop: string]: string;
};