import {
  Component,
  OnInit,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  ViewChild,
  ElementRef,
  AfterViewInit,
  Input, OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
} from '@angular/core';
import BScroll from '@better-scroll/core';
import ScrollBar from '@better-scroll/scroll-bar';
import MouseWheel from '@better-scroll/mouse-wheel';
import { timer } from 'rxjs';

BScroll.use(ScrollBar);
BScroll.use(MouseWheel);

@Component({
  selector: 'app-nc-scroll',
  template: `
    <div class="nc-scroll" #wrap>
      <ng-content></ng-content>
    </div>
  `,
  styles: [`
    .nc-scroll{
      width: 100%;
      height: 100%;
      overflow: hidden;
    }
  `],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NcScrollComponent implements OnInit, AfterViewInit, OnChanges {

  @Input() data: any[];
  @Input() refreshDelay = 50;
  @Output() scrollEnd = new EventEmitter<number>();

  private bs: BScroll;

  @ViewChild('wrap', { static: true }) private wrapRef: ElementRef;

  constructor(readonly el: ElementRef) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.data) {
      this.refreshScroll();
    }
  }

  ngAfterViewInit(): void {
    this.bs = new BScroll(this.wrapRef.nativeElement, {
      scrollY: true,
      scrollbar: {
        interactive: true
      },
      mouseWheel: {}
    });
    this.bs.on('scrollEnd', ({ y }) => this.scrollEnd.emit(y));
  }

  private refresh() {
    this.bs.refresh();
  }

  refreshScroll() {
    timer(this.refreshDelay).subscribe(() => {
      this.refresh();
    });
  }

  scrollToElement(...args: any) {
    this.bs.scrollToElement.apply(this.bs, args);
  }

  scrollTo(...args: any) {
    this.bs.scrollTo.apply(this.bs, args);
  }

}
