import { Component } from '@angular/core';
import { SearchResult } from './services/data-types/common.types';
import { SearchService } from './services/search.service';
import { isEmptyObject } from './utils/tools';
import { Store } from '@ngrx/store';
import { AppStoreModule } from './store';
import { ModalTypes } from './store/reducers/member.reducer';
import { SetModalType, SetUserId } from './store/actions/member.action';
import { BatchActionsService } from './store/batch-actions.service';
import { LoginParams } from './share/nc-ui/nc-layer/nc-layer-login/nc-layer-login.component';
import { MemberService } from './services/member.service';
import { User } from './services/data-types/member.type';
import { NzMessageService } from 'ng-zorro-antd';
import { codeJson } from './utils/base64';
import { StorageService } from './services/storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  title = 'ng-ncm';
  menu = [
    { label: '发现', path: '/home' },
    { label: '歌单', path: '/sheet' }
  ];

  searchResult: SearchResult;
  user: User;
  ncRememberLogin: LoginParams;

  constructor(
    private searchServe: SearchService,
    private store$: Store<AppStoreModule>,
    private batchActionsServe: BatchActionsService,
    private memberServe: MemberService,
    private messageServe: NzMessageService,
    private storageServe: StorageService
  ) {
    const userId = this.storageServe.getStorage('nc_userid');
    if (userId) {
      this.memberServe.getUserDetail(userId).subscribe(user => this.user = user);
      this.store$.dispatch(SetUserId({ id: userId.toString() }));
    }

    const ncRememberLogin = this.storageServe.getStorage('nc_remember_login');
    this.ncRememberLogin = JSON.parse(ncRememberLogin);
  }

  onSearchChange(keywords: string) {
    if (keywords) {
      this.searchServe.search(keywords).subscribe(res => {
        this.searchResult = this.highlightKeyWords(keywords, res);
      });
    } else {
      this.searchResult = {};
    }
  }

  private highlightKeyWords(keywords: string, result: SearchResult): SearchResult {
    if (!isEmptyObject(result)) {
      const reg = new RegExp(keywords, 'ig');
      ['artists', 'playlists', 'songs'].forEach(type => {
        if (result[type]) {
          result[type].forEach(item => {
            item.name = item.name.replace(reg, '<span class="highlight">$&</span>');
          });
        }
      });
    }
    return result;
  }

  // 改变弹窗类型
  onChangeModalType(modalType = ModalTypes.Default) {
    this.store$.dispatch(SetModalType({ modalType }));
  }

  openModal(type: ModalTypes) {
    this.batchActionsServe.controlModal(true, type);
  }

  // 登录
  onLogin(params: LoginParams) {
    this.memberServe.login(params).subscribe(user => {
      this.user = user;
      this.batchActionsServe.controlModal(false);
      this.alertMessage('success', '登录成功');
      this.storageServe.setStorage({
        key: 'nc_userid',
        value: user.profile.userId
      });
      this.store$.dispatch(SetUserId({ id: user.profile.userId.toString() }));
      if (params.remember) {
        this.storageServe.setStorage({
          key: 'nc_remember_login',
          value: JSON.stringify(codeJson(params))
        });
      } else {
        this.storageServe.removeStorage('nc_remember_login');
      }
    }, ({ error }) => {
      this.alertMessage('error', error.message || '登录失败');
    });
  }

  logout() {
    this.memberServe.logout().subscribe(res => {
      this.user = null;
      this.alertMessage('success', '已退出');
      this.storageServe.removeStorage('nc_userid');
    }, ({ error }) => {
      this.alertMessage('error', error.message || '退出失败');
    });
  }

  alertMessage(type: string, message: string) {
    this.messageServe.create(type, message);
  }
}
