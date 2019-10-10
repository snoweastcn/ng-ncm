import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NcPlayerComponent } from './nc-player.component';
import { NcSliderModule } from '../nc-slider/nc-slider.module';
import { FormatTimePipe } from '../../pipes/format-time.pipe';



@NgModule({
  declarations: [NcPlayerComponent, FormatTimePipe],
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
