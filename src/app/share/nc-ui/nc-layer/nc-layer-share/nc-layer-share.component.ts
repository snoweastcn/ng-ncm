import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { ShareInfo } from 'src/app/store/reducers/member.reducer';
import { ShareParams } from 'src/app/services/member.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

const MAX_MSG = 140;

@Component({
  selector: 'app-nc-layer-share',
  templateUrl: './nc-layer-share.component.html',
  styleUrls: ['./nc-layer-share.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NcLayerShareComponent implements OnInit, OnChanges {
  @Input() shareInfo: ShareInfo;
  @Input() visible = false;
  @Output() cancel = new EventEmitter<void>();
  @Output() share = new EventEmitter<ShareParams>();

  formModel: FormGroup;
  surplusMsgCount = MAX_MSG;
  constructor() {
    this.formModel = new FormGroup({
      msg: new FormControl('', Validators.maxLength(MAX_MSG))
    });
    this.formModel.get('msg').valueChanges.subscribe(msg => {
      this.surplusMsgCount = MAX_MSG - msg.length;
    });
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.visible && !changes.visible.firstChange) {
      this.formModel.get('msg').markAsTouched();
    }
  }

  onSubmit() {
    if (this.formModel.valid) {
      this.share.emit({
        id: this.shareInfo.id,
        msg: this.formModel.get('msg').value,
        type: this.shareInfo.type
      });
    }
  }

}
