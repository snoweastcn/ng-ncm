import { Component, OnInit, Input, OnChanges, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { NcSliderStyle } from './nc-slider-types';

@Component({
  selector: 'app-nc-slider-track',
  template: `<div class="nc-slider-track" [ngStyle]="style" [class.buffer]="ncBuffer"></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NcSliderTrackComponent implements OnInit, OnChanges {
  @Input() ncVertical = false;
  @Input() ncLength: number;
  @Input() ncBuffer = false;

  style: NcSliderStyle = {};
  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    const key = 'ncLength';
    if (changes[key]) {
      if (this.ncVertical) {
        this.style.height = this.ncLength + '%';
        this.style.left = null;
        this.style.width = null;
      } else {
        this.style.width = this.ncLength + '%';
        this.style.bottom = null;
        this.style.height = null;
      }
    }
  }
}
