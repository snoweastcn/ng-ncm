import { Directive, ElementRef, Renderer2, Inject, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Directive({
  selector: '[appClickoutside]'
})
export class ClickoutsideDirective implements OnChanges {

  private handleClick: () => void;
  @Input() bingFlag = false;
  @Output() clickOutSide = new EventEmitter<void>();
  constructor(private el: ElementRef, private rd2: Renderer2, @Inject(DOCUMENT) private doc: Document) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.bingFlag && !changes.bingFlag.firstChange) {
      if (this.bingFlag) {
        this.handleClick = this.rd2.listen(this.doc, 'click', evt => {
          const target = evt.target;
          const isContain = this.el.nativeElement.contains(evt.target);
          if (!isContain) {
            this.clickOutSide.emit(target);
          }
        });
      } else {
        this.handleClick();
      }
    }
  }

}
