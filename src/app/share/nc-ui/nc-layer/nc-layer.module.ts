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



@NgModule({
  declarations: [NcLayerModalComponent, NcLayerDefaultComponent, NcLayerLoginComponent],
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
  exports: [NcLayerModalComponent, NcLayerDefaultComponent, NcLayerLoginComponent]
})
export class NcLayerModule { }
