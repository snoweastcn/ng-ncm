import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NcPlayerComponent } from './nc-player.component';



@NgModule({
  declarations: [NcPlayerComponent],
  imports: [
    CommonModule
  ],
  exports: [
    NcPlayerComponent
  ]
})
export class NcPlayerModule { }
