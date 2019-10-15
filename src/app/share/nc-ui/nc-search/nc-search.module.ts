import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NcSearchComponent } from './nc-search.component';
import { NzIconModule, NzInputModule } from 'ng-zorro-antd';
import { NcSearchPanelComponent } from './nc-search-panel/nc-search-panel.component';
import { OverlayModule } from '@angular/cdk/overlay';



@NgModule({
  declarations: [
    NcSearchComponent,
    NcSearchPanelComponent
  ],
  imports: [
    CommonModule,
    NzIconModule,
    NzInputModule,
    OverlayModule
  ],
  exports: [NcSearchComponent],
  entryComponents: [
    NcSearchPanelComponent
  ]
})
export class NcSearchModule { }
