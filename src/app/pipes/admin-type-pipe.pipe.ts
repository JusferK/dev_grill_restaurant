import { Pipe, PipeTransform } from '@angular/core';
import { IAdminType } from '../models/admin-type.models';

@Pipe({
  name: 'description',
  standalone: true
})
export class AdminTypePipePipe implements PipeTransform {

  transform(value: IAdminType): string {
    return `${value.description}`;
  }

}
