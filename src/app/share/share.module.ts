import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { NcUiModule } from './nc-ui/nc-ui.module';




@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    NgZorroAntdModule,
    NcUiModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    NgZorroAntdModule,
    NcUiModule,
  ]
})
export class ShareModule { }
