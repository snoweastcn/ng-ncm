import { NgModule } from '@angular/core';
import { ShareModule } from 'src/app/share/share.module';

import { SongInfoRoutingModule } from './song-info-routing.module';
import { SongInfoComponent } from './song-info.component';


@NgModule({
  declarations: [SongInfoComponent],
  imports: [
    ShareModule,
    SongInfoRoutingModule
  ]
})
export class SongInfoModule { }
