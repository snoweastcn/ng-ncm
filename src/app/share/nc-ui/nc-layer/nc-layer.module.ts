import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NcLayerModalComponent } from './nc-layer-modal/nc-layer-modal.component';
import { NcLayerDefaultComponent } from './nc-layer-default/nc-layer-default.component';
import {
  NzButtonModule,
  NzIconModule,
  NzCheckboxModule,
  NzSpinModule,
  NzAlertModule,
  NzListModule,
  NzFormModule,
  NzInputModule
} from 'ng-zorro-antd';
import { NcLayerLoginComponent } from './nc-layer-login/nc-layer-login.component';
import { NcLayerLikeComponent } from './nc-layer-like/nc-layer-like.component';
import { NcLayerShareComponent } from './nc-layer-share/nc-layer-share.component';
import { NcLayerRegisterComponent } from './nc-layer-register/nc-layer-register.component';
import { NcCheckCodeComponent } from './nc-check-code/nc-check-code.component';
import { NcCodeComponent } from './nc-check-code/nc-code/nc-code.component';



@NgModule({
  declarations: [
    NcLayerModalComponent,
    NcLayerDefaultComponent,
    NcLayerLoginComponent,
    NcLayerLikeComponent,
    NcLayerShareComponent,
    NcLayerRegisterComponent,
    NcCheckCodeComponent,
    NcCodeComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DragDropModule,
    NzButtonModule,
    NzInputModule,
    NzCheckboxModule,
    NzSpinModule,
    NzAlertModule,
    NzListModule,
    NzIconModule,
    NzFormModule,
  ],
  exports: [
    NcLayerModalComponent,
    NcLayerDefaultComponent,
    NcLayerLoginComponent,
    NcLayerRegisterComponent,
    NcLayerLikeComponent,
    NcLayerShareComponent,
    NcCheckCodeComponent
  ]
})
export class NcLayerModule { }
