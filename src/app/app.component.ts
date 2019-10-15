import { Component } from '@angular/core';
import { SearchResult } from './services/data-types/common.types';
import { SearchService } from './services/search.service';
import { isEmptyObject } from './utils/tools';
import { Store } from '@ngrx/store';
import { AppStoreModule } from './store';
import { ModalTypes } from './store/reducers/member.reducer';
import { SetModalType } from './store/actions/member.action';

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

  constructor(
    private searchServe: SearchService,
    private store$: Store<AppStoreModule>
  ) { }

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
}
