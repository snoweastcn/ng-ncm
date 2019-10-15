import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ElementRef,
  ChangeDetectorRef,
  ViewChild,
  AfterViewInit,
  Renderer2,
  Inject,
  Input
} from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppStoreModule } from 'src/app/store';
import { getModalVisible, getModalType } from 'src/app/store/selectors/member.selector';
import { ModalTypes } from 'src/app/store/reducers/member.reducer';
import { Overlay, OverlayRef, OverlayKeyboardDispatcher, BlockScrollStrategy, OverlayContainer } from '@angular/cdk/overlay';
import { BatchActionsService } from 'src/app/store/batch-actions.service';
import { ESCAPE } from '@angular/cdk/keycodes';
import { DOCUMENT } from '@angular/common';
import { WINDOW } from 'src/app/services/services.module';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-nc-layer-modal',
  templateUrl: './nc-layer-modal.component.html',
  styleUrls: ['./nc-layer-modal.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [trigger('showHide', [
    state('show', style({ transform: 'scale(1)', opacity: 1 })),
    state('hide', style({ transform: 'scale(0)', opacity: 0 })),
    transition('show<=>hide', animate('0.1s'))
  ])]
})
export class NcLayerModalComponent implements OnInit, AfterViewInit {
  showModal = 'hide';
  private visible = false;
  currentModalType = ModalTypes.Default;
  private overlayRef: OverlayRef;
  private scrollStrategy: BlockScrollStrategy;
  private resizeHandler: () => void;
  private overlayContainerEl: HTMLElement;
  // @Input() currentModalType = ModalTypes.Default;

  @ViewChild('modalContainer', { static: true }) private modalRef: ElementRef;

  constructor(
    @Inject(DOCUMENT) private doc: Document,
    @Inject(WINDOW) private win: Window,
    private store$: Store<AppStoreModule>,
    private overlay: Overlay,
    private elementRef: ElementRef,
    private overlayKeyboardDispatch: OverlayKeyboardDispatcher,
    private cdr: ChangeDetectorRef,
    private batchActionsServe: BatchActionsService,
    private rd: Renderer2,
    private overlayContainerServe: OverlayContainer
  ) {
    const appStore$ = this.store$.pipe(select('member'));
    appStore$.pipe(select(getModalVisible)).subscribe(visib => this.watchModalVisible(visib));
    appStore$.pipe(select(getModalType)).subscribe(type => this.watchModalType(type));
    this.scrollStrategy = this.overlay.scrollStrategies.block();

  }

  ngOnInit() {
    this.createOverlay();
  }

  ngAfterViewInit(): void {
    this.overlayContainerEl = this.overlayContainerServe.getContainerElement();
    this.listenResizeToCenter();
  }

  listenResizeToCenter() {
    const modal = this.modalRef.nativeElement;
    const modalSize = this.getHideDomSize(modal);
    console.log(modalSize);
    this.keepCenter(modal, modalSize);
    this.resizeHandler = this.rd.listen('window', 'resize', () => this.keepCenter(modal, modalSize));
  }

  private keepCenter(modal: HTMLElement, size: { w: number, h: number }) {
    const left = (this.getWindowSize().w - size.w) / 2;
    const top = (this.getWindowSize().h - size.h) / 2;
    modal.style.left = left + 'px';
    modal.style.top = top + 'px';
  }

  private getWindowSize() {
    return {
      w: this.win.innerWidth || this.doc.documentElement.clientWidth || this.doc.body.offsetWidth,
      h: this.win.innerHeight || this.doc.documentElement.clientHeight || this.doc.body.offsetHeight,
    };
  }

  private getHideDomSize(dom: HTMLElement) {
    return {
      w: dom.offsetWidth,
      h: dom.offsetHeight
    };
  }

  private createOverlay() {
    this.overlayRef = this.overlay.create();
    this.overlayRef.overlayElement.appendChild(this.elementRef.nativeElement);
    this.overlayRef.keydownEvents().subscribe(e => this.keydownListener(e));
  }

  private keydownListener(e: KeyboardEvent) {
    if (e.keyCode === ESCAPE) {
      this.hide();
    }
  }

  private watchModalVisible(visib: boolean) {
    if (this.visible !== visib) {
      this.visible = visib;
      this.handleVisibleChange(visib);
    }
  }

  private handleVisibleChange(visib: boolean) {
    if (visib) {
      this.showModal = 'show';
      this.scrollStrategy.enable();
      this.overlayKeyboardDispatch.add(this.overlayRef);
      this.listenResizeToCenter();
      this.changePointerEvents('auto');
    } else {
      this.showModal = 'hide';
      this.scrollStrategy.disable();
      this.overlayKeyboardDispatch.remove(this.overlayRef);
      this.resizeHandler();
      this.changePointerEvents('none');
    }
    this.cdr.markForCheck();
  }

  private changePointerEvents(type: 'none' | 'auto') {
    if (this.overlayContainerEl) {
      this.overlayContainerEl.style.pointerEvents = type;
    }
  }

  private watchModalType(type: ModalTypes) {
    if (this.currentModalType !== type) {
      this.currentModalType = type;
      this.cdr.markForCheck();
    }
  }


  hide() {
    this.batchActionsServe.controlModal(false);
  }
}
