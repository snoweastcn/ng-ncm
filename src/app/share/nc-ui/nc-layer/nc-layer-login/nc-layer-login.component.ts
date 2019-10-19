import { Component, OnInit, ChangeDetectionStrategy, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Params } from '@angular/router';
import { codeJson } from 'src/app/utils/base64';

export interface LoginParams extends Params {
  phone: string;
  password: string;
  remember: boolean;
}

@Component({
  selector: 'app-nc-layer-login',
  templateUrl: './nc-layer-login.component.html',
  styleUrls: ['./nc-layer-login.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NcLayerLoginComponent implements OnInit, OnChanges {
  @Input() ncRememberLogin: LoginParams;
  @Input() visible = false;
  @Output() changeModalType = new EventEmitter<string | void>();
  @Output() login = new EventEmitter<LoginParams>();

  formModel: FormGroup;

  constructor(private fb: FormBuilder) {
    this.formModel = this.fb.group({
      phone: ['', [Validators.required, Validators.pattern(/^1\d{10}$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      remember: [false]
    });
  }

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges): void {
    const userLoginParams = changes.ncRememberLogin;
    const visible = changes.visible;
    if (userLoginParams) {
      let phone = '';
      let password = '';
      let remember = false;
      if (userLoginParams.currentValue) {
        const value = codeJson(userLoginParams.currentValue, 'decode');
        phone = value.phone;
        password = value.password;
        remember = value.remember;
      }
      this.setModel({ phone, password, remember });
    }

    if (visible && !visible.firstChange) {
      this.formModel.markAllAsTouched();
    }
  }

  private setModel({ phone, password, remember }) {
    this.formModel = this.fb.group({
      phone: [phone, [Validators.required, Validators.pattern(/^1\d{10}$/)]],
      password: [password, [Validators.required, Validators.minLength(6)]],
      remember: [remember]
    });
  }

  onSubmit() {
    const model = this.formModel;
    if (model.valid) {
      this.login.emit(model.value);
    }
  }

}
