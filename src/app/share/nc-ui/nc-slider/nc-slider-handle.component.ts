import { Component, OnInit, Input, OnChanges, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { NcSliderStyle } from './nc-slider-types';

@Component({
  selector: 'app-nc-slider-handle',
  template: `<div class="nc-slider-handle" [ngStyle]="style"></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NcSliderHandleComponent implements OnInit, OnChanges {
  @Input() ncVertical = false;
  @Input() ncOffset: number;

  style: NcSliderStyle = {};
  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    const key = 'ncOffset';
    if (changes[key]) {
      this.style[this.ncVertical ? 'bottom' : 'left'] = this.ncOffset + '%';
    }
  }
}
