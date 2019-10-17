import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { User } from 'src/app/services/data-types/member.type';
import { MemberService } from 'src/app/services/member.service';
import { NzMessageService } from 'ng-zorro-antd';
import { timer } from 'rxjs';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.less']
})
export class MemberCardComponent implements OnInit {
  @Input() user: User;
  @Output() openModal = new EventEmitter<any>();
  point: number;
  tipTitle = '';
  showTip = false;
  constructor(
    private memberServe: MemberService,
    private messageServe: NzMessageService
  ) { }

  ngOnInit() {
  }

  onSignin() {
    this.memberServe.signin().subscribe(res => {
      this.alertMessage('success', '签到成功');
      this.tipTitle = '积分+' + res.point;
      this.showTip = true;
      timer(1500).subscribe(() => {
        this.showTip = false;
        this.tipTitle = '';
      });
    }, error => {
      this.alertMessage('error', error.msg || '签到失败');
    });
  }

  private alertMessage(type: string, msg: string) {
    this.messageServe.create(type, msg);
  }

}
