import { NgModule } from '@angular/core';
import { SingleSheetComponent } from './single-sheet/single-sheet.component';
import { PlayCountPipe } from '../pipes/play-count.pipe';
import { NcPlayerModule } from './nc-player/nc-player.module';
import { NcSearchModule } from './nc-search/nc-search.module';
import { NcLayerModule } from './nc-layer/nc-layer.module';



@NgModule({
  declarations: [SingleSheetComponent, PlayCountPipe],
  imports: [NcPlayerModule, NcSearchModule, NcLayerModule],
  exports: [
    SingleSheetComponent,
    NcPlayerModule,
    NcSearchModule,
    NcLayerModule
  ]
})
export class NcUiModule { }
