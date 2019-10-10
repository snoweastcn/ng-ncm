import {
  Component,
  OnInit,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  ElementRef, ViewChild,
  Input,
  Inject,
  ChangeDetectorRef,
  OnDestroy,
  forwardRef,
  Output,
  EventEmitter
} from '@angular/core';
import { fromEvent, merge, Observable, Subscription } from 'rxjs';
import { tap, filter, pluck, map, distinctUntilChanged, takeUntil } from 'rxjs/internal/operators';
import { SliderEventObserverConfig, SliderValue } from './nc-slider-types';
import { DOCUMENT } from '@angular/common';
import { sliderEvent, getElementOffset } from './nc-slider-helper';
import { inArray } from 'src/app/utils/array';
import { limitNumberInRange, getPercent } from 'src/app/utils/number';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-nc-slider',
  templateUrl: './nc-slider.component.html',
  styleUrls: ['./nc-slider.component.less'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => NcSliderComponent),
    multi: true
  }]
})
export class NcSliderComponent implements OnInit, OnDestroy, ControlValueAccessor {

  @Input() ncVertical = false;
  @Input() ncMin = 0;
  @Input() ncMax = 100;
  @Input() bufferOffset: SliderValue = 0;

  @Output() ncOnAfterChange = new EventEmitter<SliderValue>();

  @ViewChild('ncSlider', { static: true }) private ncSlider: ElementRef;

  private sliderDom: HTMLDivElement;

  private dragStart$: Observable<number>;
  private dragMove$: Observable<number>;
  private dragEnd$: Observable<Event>;

  private subDragStart$: Subscription | null;
  private subDragMove$: Subscription | null;
  private subDragEnd$: Subscription | null;

  private isDragging = false;

  value: SliderValue = null;
  offset: SliderValue = null;

  constructor(@Inject(DOCUMENT) private doc: Document, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.sliderDom = this.ncSlider.nativeElement;
    this.createDraggingObservables();
    this.subscribeDrag(['start']);
  }

  private createDraggingObservables() {
    const orientField = this.ncVertical ? 'pageY' : 'pageX';
    const mouse: SliderEventObserverConfig = {
      start: 'mousedown',
      move: 'mousemove',
      end: 'mouseup',
      filters: (e: MouseEvent) => e instanceof MouseEvent,
      pluckKey: [orientField],
    };
    const touch: SliderEventObserverConfig = {
      start: 'touchstart',
      move: 'touchmove',
      end: 'touchend',
      filters: (e: TouchEvent) => e instanceof TouchEvent,
      pluckKey: ['touches', '0', orientField]
    };

    [mouse, touch].forEach(source => {
      const { start, move, end, filters, pluckKey } = source;
      source.startPlucked$ = fromEvent(this.sliderDom, start).pipe(
        filter(filters),
        tap(sliderEvent),
        pluck(...pluckKey),
        map((position: number) => this.findClosestValue(position)),
      );
      source.end$ = fromEvent(this.doc, end);
      source.moveResolved$ = fromEvent(this.doc, move).pipe(
        filter(filters),
        tap(sliderEvent),
        pluck(...pluckKey),
        distinctUntilChanged(),
        map((position: number) => this.findClosestValue(position)),
        takeUntil(source.end$),
      );
    });

    this.dragStart$ = merge(mouse.startPlucked$, touch.startPlucked$);
    this.dragMove$ = merge(mouse.moveResolved$, touch.moveResolved$);
    this.dragEnd$ = merge(mouse.end$, touch.end$);
  }

  private subscribeDrag(events: string[] = ['start', 'move', 'end']) {
    if (inArray(events, 'start') && this.dragStart$ && !this.subDragStart$) {
      this.subDragStart$ = this.dragStart$.subscribe(this.onDragStart.bind(this));
    }
    if (inArray(events, 'move') && this.dragMove$ && !this.subDragMove$) {
      this.subDragMove$ = this.dragMove$.subscribe(this.onDragMove.bind(this));
    }
    if (inArray(events, 'end') && this.dragEnd$ && !this.subDragEnd$) {
      this.subDragEnd$ = this.dragEnd$.subscribe(this.onDragEnd.bind(this));
    }
  }

  private unSubscribeDrag(events: string[] = ['start', 'move', 'end']) {
    if (inArray(events, 'start') && this.subDragStart$) {
      this.subDragStart$.unsubscribe();
      this.subDragStart$ = null;
    }
    if (inArray(events, 'move') && this.subDragMove$) {
      this.subDragMove$.unsubscribe();
      this.subDragMove$ = null;
    }
    if (inArray(events, 'end') && this.subDragEnd$) {
      this.subDragEnd$.unsubscribe();
      this.subDragEnd$ = null;
    }
  }

  private onDragStart(value: number) {
    this.toggleDragMoving(true);
    this.setValue(value);
  }
  private onDragMove(value: number) {
    if (this.isDragging) {
      this.setValue(value);
      this.cdr.markForCheck();
    }

  }
  private onDragEnd() {
    this.ncOnAfterChange.emit(this.value);
    this.toggleDragMoving(false);
    this.cdr.markForCheck();
  }

  private setValue(value: SliderValue, needCheck = false) {
    if (needCheck) {
      if (this.isDragging) {
        return;
      } else {
        this.value = this.formatValue(value);
        this.updateTrackAndHandle();
      }
    } else if (!this.valuesEqual(this.value, value)) {
      this.value = value;
      this.updateTrackAndHandle();
      this.onValueChange(this.value);
    }
  }

  private formatValue(value: SliderValue): SliderValue {
    let res = value;
    if (this.assertValueValid(value)) {
      res = this.ncMin;
    } else {
      res = limitNumberInRange(value, this.ncMin, this.ncMax);
    }
    return res;
  }

  // 判断是否为NAN
  private assertValueValid(value: SliderValue): boolean {
    return isNaN(typeof value !== 'number' ? parseFloat(value) : value);
  }

  private valuesEqual(oldValue: SliderValue, newValue: SliderValue): boolean {
    if (typeof oldValue !== typeof newValue) {
      return false;
    }
  }

  private updateTrackAndHandle() {
    this.offset = this.getValueToOffset(this.value);
    this.cdr.markForCheck();
  }

  private getValueToOffset(value: SliderValue): SliderValue {
    return getPercent(value, this.ncMin, this.ncMax);
  }

  private toggleDragMoving(moveable: boolean) {
    this.isDragging = moveable;
    if (moveable) {
      this.subscribeDrag(['move', 'end']);
    } else {
      this.unSubscribeDrag(['move', 'end']);
    }
  }

  private findClosestValue(position: number): number {
    // 获取滑块总长
    const sliderLength = this.getSliderLength();
    // 获取（左上）端点位置
    const sliderStart = this.getSliderStartPosition();
    // 滑块档当前位置 / 滑块总长
    const radio = limitNumberInRange((position - sliderStart) / sliderLength, 0, 1);
    const radioTrue = this.ncVertical ? 1 - radio : radio;
    return radioTrue * (this.ncMax - this.ncMin) + this.ncMin;
  }

  private getSliderLength(): number {
    return this.ncVertical ? this.sliderDom.clientHeight : this.sliderDom.clientWidth;
  }

  private getSliderStartPosition(): number {
    const offset = getElementOffset(this.sliderDom);
    return this.ncVertical ? offset.top : offset.left;
  }

  private onValueChange(value: SliderValue): void { }

  private onTouched(): void { }

  writeValue(value: SliderValue): void {
    this.setValue(value, true);
  }

  registerOnChange(fn: (value: SliderValue) => void): void {
    this.onValueChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  ngOnDestroy() {
    this.unSubscribeDrag();
  }
}
