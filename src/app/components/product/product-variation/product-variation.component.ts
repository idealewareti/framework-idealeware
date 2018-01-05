import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Sku } from "../../../models/product/sku";
import { Variation } from "../../../models/product/variation";
import { VariationOption } from "../../../models/product/product-variation-option";

@Component({
    moduleId: module.id,
    selector: 'app-product-variation',
    templateUrl: '../../../template/product/product-variation/product-variation.html',
    styleUrls: ['../../../template/product/product-variation/product-variation.scss']
})
export class ProductVariationComponent implements OnInit {
    @Input() skus: Sku[] = [];
    @Input() selected: Sku = new Sku();
    @Output() skuUpdated: EventEmitter<Sku> = new EventEmitter<Sku>();
    @Output() allOptionsSelected: EventEmitter<boolean> = new EventEmitter<boolean>();

    variations: Variation[] = [];
    options: VariationOption[] = [];
    optionsSelected: Variation[] = [];

    constructor() { }

    ngOnInit() {
        this.skus.forEach(sku => {
            this.variations = this.getVariationsDistinct(sku.variations, this.variations);
            sku.variations.forEach(variation => {
                this.options = this.getOptionsDistinct(variation.option, this.options);
            })
        });

        this.selected.variations.forEach(variation => {
            this.optionsSelected.push(new Variation(variation));
        });

    }

    /**
     * Retorna somente as variações únicas
     * 
     * @private
     * @param {Variation[]} variations 
     * @param {Variation[]} uniques 
     * @returns {Variation[]} 
     * 
     * @memberof ProductVariationComponent
     */
    private getVariationsDistinct(variations: Variation[], uniques: Variation[]): Variation[] {
        variations.forEach(v => {
            if (uniques.filter(u => u.id == v.id).length == 0)
                uniques.push(v);
        });
        return uniques;
    }

    /**
     * Retorna somente as opções únicas
     * 
     * @private
     * @param {VariationOption[]} options  Opção a analisar
     * @param {VariationOption[]} uniques  Coleção de opções já adicionadas
     * @returns {VariationOption[]} 
     * 
     * @memberof ProductVariationComponent
     */
    private getOptionsDistinct(option: VariationOption, uniques: VariationOption[]): VariationOption[] {
        if (uniques.filter(u => u.id == option.id).length == 0)
            uniques.push(option);
        return uniques;
    }

    getOptionsFromVariation(variation: Variation): VariationOption[] {
        let options = [];

        let skus: Sku[] = [];
        if (this.optionsSelected.length > 0 && this.variations.findIndex(v => v.id == variation.id) > 0)
            skus = this.getSkusAvailable(this.optionsSelected[0]);
        else skus = this.skus;

        skus.forEach(sku => {
            sku.variations.filter(v => v.id == variation.id).forEach(f => {
                options = this.getOptionsDistinct(f.option, options);
            });
        });

        if (options.length == 1) {
            this.selectOption(variation, options[0]);
        }

        this.allOptionsSelected.emit(this.variations.length == this.optionsSelected.length);

        return options;
    }

    getSkusAvailable(variation: Variation, list: Sku[] = null) {
        let skus = [];

        if (!list)
            list = this.skus;

        list.forEach(sku => {
            if (sku.variations.findIndex(v => v.id == variation.id && v.option.id == variation.option.id) > -1)
                skus.push(sku);
        });
        return skus;
    }


    /* Validators */
    isSelected(sku: Sku): boolean {
        if (sku.id == this.selected.id)
            return true;
        else return false;
    }

    isOptionSelected(option: VariationOption): boolean {
        if (this.optionsSelected.findIndex(selected => selected.option.id == option.id) > -1)
            return true;
        else return false;
    }

    isVariationSelected(variation: Variation): boolean {
        if (this.optionsSelected.findIndex(selected => selected.id == variation.id) > -1)
            return true;
        else return false;
    }

    /* Actions */
    selectOption(variation: Variation, option: VariationOption, event = null) {
        if (event)
            event.preventDefault();

        let selected = new Variation(variation);
        selected.option = new VariationOption(option);

        if (this.isVariationSelected(selected)) {
            let index = this.optionsSelected.findIndex(v => v.id == selected.id);
            this.optionsSelected.splice(index);
        }

        this.optionsSelected.push(selected);
        this.findSku();
    }

    findSku() {
        let skus: Sku[] = this.skus;
        this.optionsSelected.forEach(v => {
            skus = this.getSkusAvailable(v, skus);
        });
        if (skus.length == 1) {
            this.selected = skus[0];
            this.skuUpdated.emit(this.selected);
        }

        return skus;
    }
}