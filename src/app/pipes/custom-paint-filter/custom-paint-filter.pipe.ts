import { Pipe, PipeTransform } from '@angular/core';
import { CustomPaintColor } from '../../models/custom-paint/custom-paint-color';

@Pipe({ name: 'customcolorFilter' })
export class CustomPaintFilterPipe implements PipeTransform {
    transform(colors: CustomPaintColor[], value: string): CustomPaintColor[] {
        if (value)
            return colors.filter(color => (color.name.toLowerCase().indexOf(value.toLowerCase()) !== -1) || (color.code.toLowerCase().indexOf(value.toLowerCase()) !== -1))
        else
            return colors;
    }
}