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
  Output,
  EventEmitter,
  Input,
  OnChanges,
  SimpleChanges,
  PLATFORM_ID
} from '@angular/core';
import { ModalTypes } from 'src/app/store/reducers/member.reducer';
import { Overlay, OverlayRef, OverlayKeyboardDispatcher, BlockScrollStrategy, OverlayContainer } from '@angular/cdk/overlay';
import { BatchActionsService } from 'src/app/store/batch-actions.service';
import { ESCAPE } from '@angular/cdk/keycodes';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { trigger, state, style, transition, animate } from '@angular/animations';


interface SizeType { w: number; h: number; }

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
export class NcLayerModalComponent implements OnInit, AfterViewInit, OnChanges {

  modalTitle = {
    register: '注册',
    loginByPhone: '手机登录',
    share: '分享',
    like: '收藏',
    default: ''
  };

  @Input() visible = false;
  @Input() showSpin = false;
  @Input() currentModalType = ModalTypes.Default;
  @Output() loadMySheets = new EventEmitter<void>();
  @ViewChild('modalContainer', { static: true }) private modalRef: ElementRef;

  showModal = 'hide';
  private overlayRef: OverlayRef;
  private scrollStrategy: BlockScrollStrategy;
  private resizeHandler: () => void;
  private overlayContainerEl: HTMLElement;

  private isBrowser: boolean;

  constructor(
    @Inject(PLATFORM_ID) private plateformId: object,
    @Inject(DOCUMENT) private doc: Document,
    private overlay: Overlay,
    private elementRef: ElementRef,
    private overlayKeyboardDispatch: OverlayKeyboardDispatcher,
    private cdr: ChangeDetectorRef,
    private batchActionsServe: BatchActionsService,
    private rd: Renderer2,
    private overlayContainerServe: OverlayContainer
  ) {
    this.isBrowser = isPlatformBrowser(this.plateformId);
    this.scrollStrategy = this.overlay.scrollStrategies.block();
  }

  ngOnInit() {
    this.createOverlay();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.visible && !changes.visible.firstChange) {
      this.handleVisibleChange(this.visible);
    }
  }

  ngAfterViewInit(): void {
    this.overlayContainerEl = this.overlayContainerServe.getContainerElement();
    this.listenResizeToCenter();
  }

  listenResizeToCenter() {
    if (this.isBrowser) {
      const modal = this.modalRef.nativeElement;
      const modalSize = this.getHideDomSize(modal);
      this.keepCenter(modal, modalSize);
      this.resizeHandler = this.rd.listen('window', 'resize', () => this.keepCenter(modal, modalSize));
    }
  }

  private keepCenter(modal: HTMLElement, size: SizeType) {
    const left = (this.getWindowSize().w - size.w) / 2;
    const top = (this.getWindowSize().h - size.h) / 2;
    modal.style.left = left + 'px';
    modal.style.top = top + 'px';
  }

  private getWindowSize(): SizeType {
    return {
      w: window.innerWidth || this.doc.documentElement.clientWidth || this.doc.body.offsetWidth,
      h: window.innerHeight || this.doc.documentElement.clientHeight || this.doc.body.offsetHeight,
    };
  }

  private getHideDomSize(dom: HTMLElement): SizeType {
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
    // tslint:disable-next-line: deprecation
    if (e.keyCode === ESCAPE) {
      this.hide();
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

  hide() {
    this.batchActionsServe.controlModal(false);
  }
}
