import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef, SimpleChanges, OnChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MemberService } from 'src/app/services/member.service';
import { NzMessageService } from 'ng-zorro-antd';
import { ModalTypes } from 'src/app/store/reducers/member.reducer';
import { interval } from 'rxjs';
import { take } from 'rxjs/internal/operators';

enum Exist {
  '存在' = 1,
  '不存在' = -1
}

@Component({
  selector: 'app-nc-layer-register',
  templateUrl: './nc-layer-register.component.html',
  styleUrls: ['./nc-layer-register.component.less']
})
export class NcLayerRegisterComponent implements OnInit, OnChanges {
  @Input() visible = false;
  @Output() changeModalType = new EventEmitter<string>();
  @Output() register = new EventEmitter<string>();
  showCode = false;
  timing: number;
  codePass: string | boolean = '';
  formModel: FormGroup;
  constructor(
    private fb: FormBuilder,
    private memberServe: MemberService,
    private messageServe: NzMessageService,
    private cdr: ChangeDetectorRef
  ) {
    this.formModel = this.fb.group({
      phone: ['', [Validators.required, Validators.pattern(/^1\d{10}$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.visible && !changes.visible.firstChange) {
      this.formModel.markAllAsTouched();
      if (!this.visible) {
        this.showCode = false;
      }
    }
  }

  onSubmit() {
    if (this.formModel.valid) {
      this.sendCode();
    }
  }

  sendCode() {
    this.memberServe.sendCode(this.formModel.get('phone').value).subscribe(() => {
      this.timing = 60;
      if (!this.showCode) {
        this.showCode = true;
      }
      this.cdr.markForCheck();
      interval(1000).pipe(take(60)).subscribe(() => {
        this.timing--;
        this.cdr.markForCheck();
      });
    }, error => this.messageServe.error(error.message));
  }


  onCheckCode(code: string) {
    this.memberServe.checkCode(this.formModel.get('phone').value, code)
    .subscribe(
      () => this.codePass = true,
      () => this.codePass = false,
      () => this.cdr.markForCheck()
    );
  }

  onCheckExist() {
    const phone = this.formModel.get('phone').value;
    this.memberServe.checkExist(phone).subscribe(res => {
      if (Exist[res] === '存在') {
        this.messageServe.error('账号已存在，可直接登陆');
        this.changeType(ModalTypes.LoginByPhone);
      } else {
        this.register.emit(phone);
      }
    });
  }

  changeType(type = ModalTypes.Default) {
    this.changeModalType.emit(type);
    this.showCode = false;
    this.formModel.reset();
  }

}
