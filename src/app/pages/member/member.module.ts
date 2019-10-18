import { NgModule } from '@angular/core';
import { ShareModule } from 'src/app/share/share.module';

import { MemberRoutingModule } from './member-routing.module';
import { CenterComponent } from './center/center.component';
import { RecordsComponent } from './components/records/records.component';
import { RecordsDetailComponent } from './records-detail/records-detail.component';


@NgModule({
  declarations: [CenterComponent, RecordsComponent, RecordsDetailComponent],
  imports: [
    ShareModule,
    MemberRoutingModule
  ]
})
export class MemberModule { }
