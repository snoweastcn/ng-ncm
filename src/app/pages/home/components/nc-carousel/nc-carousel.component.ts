import { Component, OnInit, TemplateRef, ViewChild, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-nc-carousel',
  templateUrl: './nc-carousel.component.html',
  styleUrls: ['./nc-carousel.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NcCarouselComponent implements OnInit {
  @Input() activeIndex = 0;
  @Output() changeSlide = new EventEmitter<'pre' | 'next'>();
  @ViewChild('dot', { static: true }) dotRef: TemplateRef<any>;
  constructor() { }

  ngOnInit() {
  }

  onChangeSlide(type: 'pre' | 'next') {
    this.changeSlide.emit(type);
  }

}
