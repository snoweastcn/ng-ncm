import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  forwardRef,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  ChangeDetectorRef
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subject, fromEvent } from 'rxjs';
import { takeUntil } from 'rxjs/internal/operators';
import { BACKSPACE } from '@angular/cdk/keycodes';

const CODELEN = 4;

@Component({
  selector: 'app-nc-code',
  templateUrl: './nc-code.component.html',
  styleUrls: ['./nc-code.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => NcCodeComponent),
    multi: true
  }]
})
export class NcCodeComponent implements OnInit, ControlValueAccessor, AfterViewInit, OnDestroy {
  @ViewChild('codeWrap', { static: true }) private codeWrap: ElementRef;
  private code: string;
  inputArr = [];
  result: string[] = [];
  inputsEl: HTMLElement[];
  private destory$ = new Subject();
  currentFocusIndex = 0;
  constructor(private cdr: ChangeDetectorRef) {
    this.inputArr = Array(CODELEN).fill('');
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.inputsEl = this.codeWrap.nativeElement.getElementsByClassName('item') as HTMLElement[];
    this.inputsEl[0].focus();
    for (let a = 0; a < this.inputsEl.length; a++) {
      const item = this.inputsEl[a];
      fromEvent(item, 'keyup').pipe(takeUntil(this.destory$)).subscribe((event: KeyboardEvent) => this.listenKeyUp(event));
      fromEvent(item, 'click').pipe(takeUntil(this.destory$)).subscribe(() => this.currentFocusIndex = a);
    }
  }

  private listenKeyUp(event: KeyboardEvent) {
    const target = event.target as HTMLInputElement;
    const value = target.value;
    // tslint:disable-next-line: deprecation
    const isBackSpack = event.keyCode === BACKSPACE;
    if (/\D/.test(value)) {
      target.value = '';
      this.result[this.currentFocusIndex] = '';
    } else if (value) {
      this.result[this.currentFocusIndex] = value;
      this.currentFocusIndex = (this.currentFocusIndex + 1) % CODELEN;
      this.inputsEl[this.currentFocusIndex].focus();
    } else if (isBackSpack) {
      this.result[this.currentFocusIndex] = '';
      this.currentFocusIndex = Math.max(this.currentFocusIndex - 1, 0);
      this.inputsEl[this.currentFocusIndex].focus();
    }

    this.checkResult(this.result);
  }

  private checkResult(result: string[]) {
    const codeStr = result.join('');
    this.setValue(codeStr);
  }

  private setValue(code: string) {
    this.code = code;
    this.onValueChange(code);
    this.cdr.markForCheck();
  }

  private onValueChange(value: string): void { }

  private onTouched(): void { }

  writeValue(code: string): void {
    this.setValue(code);
  }
  registerOnChange(fn: (value: string) => void): void {
    this.onValueChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  ngOnDestroy(): void {
    this.destory$.unsubscribe();
  }

}
