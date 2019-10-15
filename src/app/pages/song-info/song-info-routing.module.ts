import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SongInfoComponent } from './song-info.component';
import { SongInfoResolveService } from './song-info-resolve.service';


const routes: Routes = [{
  path: 'songInfo/:id', component: SongInfoComponent, data: { title: '歌曲详情' }, resolve: { songInfo: SongInfoResolveService }
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [SongInfoResolveService]
})
export class SongInfoRoutingModule { }
