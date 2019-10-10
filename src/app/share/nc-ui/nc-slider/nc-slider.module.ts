import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NcSliderComponent } from './nc-slider.component';
import { NcSliderTrackComponent } from './nc-slider-track.component';
import { NcSliderHandleComponent } from './nc-slider-handle.component';



@NgModule({
  declarations: [NcSliderComponent, NcSliderTrackComponent, NcSliderHandleComponent],
  imports: [
    CommonModule
  ],
  exports: [
    NcSliderComponent,
  ]
})
export class NcSliderModule { }
