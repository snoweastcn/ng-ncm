import { Component } from '@angular/core';
import { SearchResult, SongSheet } from './services/data-types/common.types';
import { SearchService } from './services/search.service';
import { isEmptyObject } from './utils/tools';
import { Store, select } from '@ngrx/store';
import { AppStoreModule } from './store';
import { ModalTypes, ShareInfo } from './store/reducers/member.reducer';
import { SetModalType, SetUserId, SetModalVisible } from './store/actions/member.action';
import { BatchActionsService } from './store/batch-actions.service';
import { LoginParams } from './share/nc-ui/nc-layer/nc-layer-login/nc-layer-login.component';
import { MemberService, LikeSongParams, ShareParams } from './services/member.service';
import { User } from './services/data-types/member.type';
import { NzMessageService } from 'ng-zorro-antd';
import { codeJson } from './utils/base64';
import { StorageService } from './services/storage.service';
import { getLikeId, getModalVisible, getModalType, getShareInfo } from './store/selectors/member.selector';

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
  mySheets: SongSheet[];

  // 被收藏歌曲的id
  likeId: string;

  // 弹窗显示
  visible = false;

  // 弹窗loading
  showSpin = false;

  // 弹窗类型
  currentModalType = ModalTypes.Default;

  // 分享信息
  shareInfo: ShareInfo;

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

    this.listenStates();
  }

  private listenStates() {
    const appStore$ = this.store$.pipe(select('member'));
    const stateArr = [{
      type: getLikeId,
      cb: id => this.watchLikeId(id)
    }, {
      type: getModalVisible,
      cb: visib => this.watchModalVisible(visib)
    }, {
      type: getModalType,
      cb: type => this.watchModalType(type)
    }, {
      type: getShareInfo,
      cb: info => this.watchShareInfo(info)
    }];

    stateArr.forEach(item => {
      appStore$.pipe(select(item.type)).subscribe(item.cb);
    });
  }

  private watchModalVisible(visib: boolean) {
    if (this.visible !== visib) {
      this.visible = visib;
    }
  }
  private watchModalType(type: ModalTypes) {
    if (this.currentModalType !== type) {
      if (type === ModalTypes.Like) {
        this.onLoadMySheets();
      }
      this.currentModalType = type;
    }
  }

  private watchLikeId(id: string) {
    if (id) {
      this.likeId = id;
    }
  }

  private watchShareInfo(info: ShareInfo) {
    if (info) {
      if (this.user) {
        this.shareInfo = info;
        this.openModal(ModalTypes.Share);
      } else {
        this.openModal(ModalTypes.Default);
      }
    }
  }

  // 搜索
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


  // 获取当前用户的歌单
  onLoadMySheets() {
    if (this.user) {
      this.memberServe.getUserSheets(this.user.profile.userId.toString()).subscribe(userSheet => {
        this.mySheets = userSheet.self;
        this.store$.dispatch(SetModalVisible({ modalVisible: true }));
      });
    } else {

      this.openModal(ModalTypes.Default);
    }
  }

  // 收藏歌曲
  onLikeSong(args: LikeSongParams) {
    this.memberServe.likeSong(args).subscribe(() => {
      this.closeModal();
      this.alertMessage('success', '收藏成功');
    }, error => {
      this.alertMessage('error', error.msg || '收藏失败');
    });
  }

  // 新建歌单
  onCreateSheet(sheetName: string) {
    this.memberServe.createSheet(sheetName).subscribe(pid => {
      this.onLikeSong({ pid, tracks: this.likeId });
    }, error => {
      this.alertMessage('error', error.msg || '新建失败');
    });
  }

  // 分享
  onShare(arg: ShareParams) {
    this.memberServe.shareResource(arg).subscribe(() => {
      this.alertMessage('success', '分享成功');
      this.closeModal();
    }, error => {
      this.alertMessage('error', error.msg || '分享失败');
    });
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
    }, error => {
      this.alertMessage('error', error.message || '登录失败');
    });
  }

  // 退出登录
  logout() {
    this.memberServe.logout().subscribe(res => {
      this.user = null;
      this.alertMessage('success', '已退出');
      this.storageServe.removeStorage('nc_userid');
      this.store$.dispatch(SetUserId({ id: '' }));
    }, error => {
      this.alertMessage('error', error.message || '退出失败');
    });
  }

  // 改变弹窗类型
  onChangeModalType(modalType = ModalTypes.Default) {
    this.store$.dispatch(SetModalType({ modalType }));
  }

  // 打开弹窗
  openModal(type: ModalTypes) {
    this.batchActionsServe.controlModal(true, type);
  }

  // g\关闭弹窗
  closeModal() {
    this.batchActionsServe.controlModal(false);
  }

  alertMessage(type: string, message: string) {
    this.messageServe.create(type, message);
  }
}
