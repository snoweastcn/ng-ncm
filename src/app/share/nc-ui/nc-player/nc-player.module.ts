import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NcPlayerComponent } from './nc-player.component';
import { NcSliderModule } from '../nc-slider/nc-slider.module';
import { FormatTimePipe } from '../../pipes/format-time.pipe';
import { NcPlayerPanelComponent } from './nc-player-panel/nc-player-panel.component';
import { NcScrollComponent } from './nc-scroll/nc-scroll.component';
import { ClickoutsideDirective } from '../../directives/clickoutside.directive';
import { NzToolTipModule } from 'ng-zorro-antd';



@NgModule({
  declarations: [
    NcPlayerComponent,
    FormatTimePipe,
    NcPlayerPanelComponent,
    NcScrollComponent,
    ClickoutsideDirective
  ],
  imports: [
    CommonModule,
    FormsModule,
    NcSliderModule,
    NzToolTipModule
  ],
  exports: [
    NcPlayerComponent,
    ClickoutsideDirective,
    FormatTimePipe
  ]
})
export class NcPlayerModule { }
