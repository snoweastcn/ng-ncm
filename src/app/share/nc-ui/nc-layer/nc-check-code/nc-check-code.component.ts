import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-nc-check-code',
  templateUrl: './nc-check-code.component.html',
  styleUrls: ['./nc-check-code.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NcCheckCodeComponent implements OnInit, OnChanges {
  private phoneHideStr = '';
  formModel: FormGroup;
  showRepeatBtn = false;
  showErrorTip = false;
  @Input() timing: number;
  @Input() codePass = false;
  @Input()
  set phone(phone: string) {
    const arr = phone.split('');
    arr.splice(3, 4, '****');
    this.phoneHideStr = arr.join('');
  }

  get phone() {
    return this.phoneHideStr;
  }

  @Output() checkExist = new EventEmitter<void>();
  @Output() checkCode = new EventEmitter<string>();
  @Output() repeatSendCode = new EventEmitter<string>();

  constructor() {
    this.formModel = new FormGroup({
      code: new FormControl('', [Validators.required, Validators.minLength(4), Validators.pattern(/\d{4}/)])
    });

    const codeControl = this.formModel.get('code');
    codeControl.statusChanges.subscribe(status => {
      if (status === 'VALID') {
        this.checkCode.emit(this.formModel.get('code').value);
      }
    });
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.timing) {
      this.showRepeatBtn = this.timing <= 0;
    }
    if (changes.codePass && !changes.codePass.firstChange) {
      this.showErrorTip = !this.codePass;
    }
  }


  onSubmit() {
    if (this.formModel.valid && this.codePass) {
      // 检测是否已注册
      this.checkExist.emit();
    }
  }

}
