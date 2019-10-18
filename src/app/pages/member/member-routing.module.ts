import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CenterComponent } from './center/center.component';
import { CenterResolverService } from './center/center-resolve.service';
import { RecordsDetailComponent } from './records-detail/records-detail.component';
import { RecordResolverService } from './records-detail/record-resolve.service';


const routes: Routes = [{
  path: 'member/:id', component: CenterComponent, data: { title: '个人中心' }, resolve: { user: CenterResolverService }
}, {
  path: 'records/:id', component: RecordsDetailComponent, data: { title: '听歌记录' }, resolve: { user: RecordResolverService }
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [CenterResolverService, RecordResolverService]
})
export class MemberRoutingModule { }
