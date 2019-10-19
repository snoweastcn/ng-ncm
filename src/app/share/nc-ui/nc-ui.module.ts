import { NgModule } from '@angular/core';
import { SingleSheetComponent } from './single-sheet/single-sheet.component';
import { PlayCountPipe } from '../pipes/play-count.pipe';
import { NcPlayerModule } from './nc-player/nc-player.module';
import { NcSearchModule } from './nc-search/nc-search.module';
import { NcLayerModule } from './nc-layer/nc-layer.module';
import { ImgDefalutDirective } from '../directives/img-defalut.directive';



@NgModule({
  declarations: [SingleSheetComponent, PlayCountPipe, ImgDefalutDirective],
  imports: [NcPlayerModule, NcSearchModule, NcLayerModule],
  exports: [
    SingleSheetComponent,
    NcPlayerModule,
    NcSearchModule,
    NcLayerModule,
    ImgDefalutDirective
  ]
})
export class NcUiModule { }
