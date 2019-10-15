import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NcLayerModalComponent } from './nc-layer-modal/nc-layer-modal.component';
import { NcLayerDefaultComponent } from './nc-layer-default/nc-layer-default.component';
import { NzButtonModule, NzIconModule } from 'ng-zorro-antd';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NcLayerLoginComponent } from './nc-layer-login/nc-layer-login.component';



@NgModule({
  declarations: [NcLayerModalComponent, NcLayerDefaultComponent, NcLayerLoginComponent],
  imports: [
    CommonModule,
    NzButtonModule,
    NzIconModule,
    DragDropModule
  ],
  exports: [NcLayerModalComponent, NcLayerDefaultComponent, NcLayerLoginComponent]
})
export class NcLayerModule { }
