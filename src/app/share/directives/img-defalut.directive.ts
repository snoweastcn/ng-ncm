import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appImgDefalut]'
})
export class ImgDefalutDirective {

  constructor() { }

  @HostListener('mousedown', ['$event']) onMouseDown(event: Event) {
    event.preventDefault();
  }

}
