import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shorten',
  standalone: true
})
export class ShortenPipe implements PipeTransform {
  transform(value: string | null | undefined, limit: number = 20): string {
    if (!value) {
      return '';
    }
    
    if (typeof value !== 'string') {
      return String(value);
    }
    
    if (value.length > limit) {
      return value.substring(0, limit) + '...';
    }
    return value;
  }
}