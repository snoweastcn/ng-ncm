import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NcPlayerComponent } from './nc-player.component';
import { NcSliderModule } from '../nc-slider/nc-slider.module';
import { FormatTimePipe } from '../../pipes/format-time.pipe';
import { NcPlayerPanelComponent } from './nc-player-panel/nc-player-panel.component';
import { NcScrollComponent } from './nc-scroll/nc-scroll.component';



@NgModule({
  declarations: [NcPlayerComponent, FormatTimePipe, NcPlayerPanelComponent, NcScrollComponent],
  imports: [
    CommonModule,
    FormsModule,
    NcSliderModule
  ],
  exports: [
    NcPlayerComponent
  ]
})
export class NcPlayerModule { }
