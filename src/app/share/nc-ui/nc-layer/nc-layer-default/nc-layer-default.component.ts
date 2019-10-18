import { Component, OnInit, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-nc-layer-default',
  template: `
    <div class="cnzt">
      <div class="select-log">
        <div class="mid-wrap">
          <div class="pic">
            <img src="../../../../../assets/images/platform.png" />
          </div>
          <div class="methods">
            <button nz-button nzType="primary" nzSize="large" nzBlock (click)="changeModalType.emit('loginByPhone')">手机号登陆</button>
            <button nz-button nzSize="large" nzBlock (click)="changeModalType.emit('register')">注册</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./nc-layer-default.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NcLayerDefaultComponent implements OnInit {
  @Output() changeModalType = new EventEmitter<string | void>();
  constructor() { }

  ngOnInit() {
  }

}
