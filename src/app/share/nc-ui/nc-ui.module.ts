import { NgModule } from '@angular/core';
import { SingleSheetComponent } from './single-sheet/single-sheet.component';
import { PlayCountPipe } from '../play-count.pipe';
import { NcPlayerModule } from './nc-player/nc-player.module';



@NgModule({
  declarations: [SingleSheetComponent, PlayCountPipe],
  imports: [NcPlayerModule],
  exports: [
    SingleSheetComponent,
    NcPlayerModule
  ]
})
export class NcUiModule { }
