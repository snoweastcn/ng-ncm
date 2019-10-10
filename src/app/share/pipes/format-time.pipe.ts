import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatTime'
})
export class FormatTimePipe implements PipeTransform {

  transform(time: number): any {
    if (time) {
      const temp = Math.floor(time);
      const minute = Math.floor(temp / 60);
      const second = (temp % 60).toString().padStart(2, '0');
      return `${minute}:${second}`;
    } else {
      return '00:00';
    }
  }

}
