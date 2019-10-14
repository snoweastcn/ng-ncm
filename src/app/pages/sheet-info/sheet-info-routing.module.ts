import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SheetInfoComponent } from './sheet-info.component';
import { SheetInfoResolveService } from './sheet-info-resolve.service';


const routes: Routes = [{
  path: 'sheetInfo/:id', component: SheetInfoComponent, data: { title: '歌单详情' }, resolve: { sheetInfo: SheetInfoResolveService }
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [SheetInfoResolveService]
})
export class SheetInfoRoutingModule { }
