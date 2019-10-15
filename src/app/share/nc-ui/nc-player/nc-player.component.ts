import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Inject } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppStoreModule } from 'src/app/store';
import {
  getSongList,
  getPlayList,
  getCurrentIndex,
  getPlayMode,
  getCurrentSong,
  getCurrentAction
} from 'src/app/store/selectors/player.selector';
import { Song } from 'src/app/services/data-types/common.types';
import { PlayMode } from './player-type';
import { SetCurrentIndex, SetPlayMode, SetPlayList, SetCurrentAction } from 'src/app/store/actions/player.action';
import { DOCUMENT } from '@angular/common';
import { shuffle, findIndex } from 'src/app/utils/array';
import { NcPlayerPanelComponent } from './nc-player-panel/nc-player-panel.component';
import { NzModalService } from 'ng-zorro-antd';
import { BatchActionsService } from 'src/app/store/batch-actions.service';
import { Router } from '@angular/router';
import { trigger, state, style, transition, animate, AnimationEvent } from '@angular/animations';
import { CurrentActions } from 'src/app/store/reducers/player.reducer';
import { timer } from 'rxjs';

const modeTypes: PlayMode[] = [
  { type: 'loop', label: '循环' },
  { type: 'random', label: '随机' },
  { type: 'singleLoop', label: '单曲循环' },
];

enum TipTitles {
  Add = '已添加到列表',
  Play = '已开始播放'
}

@Component({
  selector: 'app-nc-player',
  templateUrl: './nc-player.component.html',
  styleUrls: ['./nc-player.component.less'],
  animations: [trigger('showHide', [
    state('show', style({ bottom: 0 })),
    state('hide', style({ bottom: -71 })),
    transition('show=>hide', [animate('0.4s')]),
    transition('hide=>show', [animate('0.2s')]),
  ])]
})
export class NcPlayerComponent implements OnInit, AfterViewInit {
  showPlayer = 'hide';
  isLocked = false;

  controlTooltip = {
    title: '',
    show: false
  };

  // 是否正在动画
  animating = false;
  @ViewChild('audio', { static: true }) private audio: ElementRef;
  @ViewChild(NcPlayerPanelComponent, { static: false }) private playPanel: NcPlayerPanelComponent;
  private audioEl: HTMLAudioElement;
  percent = 0;
  bufferPercent = 0;

  songList: Song[];
  playList: Song[];
  currentIndex: number;
  currentSong: Song;

  duration: number;
  currentTime: number;

  // 播放状态
  playing = false;
  // 是否可以播放
  songReady = false;
  // 音量
  volume = 60;

  // 是否显示音量控制面板
  showVolumePanel = false;

  // 是否显示播放列表控制面板
  showListPanel = false;

  // 是否绑定 document click 事件
  bingFlag = false;

  // 当前播放模式
  currentMode: PlayMode;

  // 播放模式切换多少次
  private modeCount = 0;

  constructor(
    private store$: Store<AppStoreModule>,
    @Inject(DOCUMENT) private doc: Document,
    private nzModalServe: NzModalService,
    private batchActionsServe: BatchActionsService,
    private router: Router
  ) {
    const appStore$ = this.store$.pipe(select('player'));

    const stateArr = [{
      type: getSongList,
      cb: (songList: Song[]) => this.watchList(songList, 'songList')
    }, {
      type: getPlayList,
      cb: (playList: Song[]) => this.watchList(playList, 'playList')
    }, {
      type: getCurrentIndex,
      cb: (currentIndex: number) => this.watchCurrentIndex(currentIndex)
    }, {
      type: getPlayMode,
      cb: (playMode: PlayMode) => this.watchPlayMode(playMode)
    }, {
      type: getCurrentSong,
      cb: (currentSong: Song) => this.watchCurrentSong(currentSong)
    }, {
      type: getCurrentAction,
      cb: (currentAction: CurrentActions) => this.watchCurrentAction(currentAction)
    }];

    stateArr.forEach(item => {
      appStore$.pipe(select(item.type)).subscribe(item.cb);
    });
  }

  ngOnInit() {

  }

  ngAfterViewInit() {
    this.audioEl = this.audio.nativeElement;
  }

  private watchList(list: Song[], type: string) {
    this[type] = list;
  }

  private watchCurrentIndex(currentIndex: number) {
    this.currentIndex = currentIndex;
  }

  private watchPlayMode(playMode: PlayMode) {
    this.currentMode = playMode;
    if (this.songList) {
      let list = this.songList.slice();
      if (playMode.type === 'random') {
        list = shuffle(this.songList);
      }
      this.updateCurrentIndex(list, this.currentSong);
      this.store$.dispatch(SetPlayList({ playList: list }));
    }
  }

  private watchCurrentSong(song: Song) {
    this.currentSong = song;
    if (song) {
      this.duration = song.dt / 1000;
    }
  }

  private watchCurrentAction(action: CurrentActions) {
    const title = TipTitles[CurrentActions[action]];
    if (title) {
      this.controlTooltip.title = title;
      if (this.showPlayer === 'hide') {
        this.togglePlayer('show');
      } else {
        this.showToolTip();
      }
    }
    this.store$.dispatch(SetCurrentAction({ currentAction: CurrentActions.Other }));
  }

  onAnimateDone(event: AnimationEvent) {
    this.animating = false;
    if (event.toState === 'show' && this.controlTooltip.title) {
      this.showToolTip();
    }
  }

  private showToolTip() {
    this.controlTooltip.show = true;
    timer(1500).subscribe(() => {
      this.controlTooltip = {
        title: '',
        show: false
      };
    });
  }

  private updateCurrentIndex(list: Song[], song: Song) {
    const newIndex = findIndex(list, song);
    this.store$.dispatch(SetCurrentIndex({ currentIndex: newIndex }));
  }

  // 切换列表面板
  toggleListPanel() {
    if (this.songList.length) {
      this.togglePanel('showListPanel');
    }
  }

  // 切换音量面板
  toggleVolPanel() {
    this.togglePanel('showVolumePanel');
  }

  private togglePanel(type: string) {
    this[type] = !this[type];
    this.bingFlag = this.showVolumePanel || this.showListPanel;
  }

  // 改变播放模式
  changeMode() {
    const temp = modeTypes[++this.modeCount % 3];
    this.store$.dispatch(SetPlayMode({ playMode: temp }));
  }

  // 播放进度
  onPercentChange(per: number) {
    if (this.currentSong) {
      const currentTime = this.duration * (per / 100);
      this.audioEl.currentTime = currentTime;
      if (this.playPanel) {
        this.playPanel.seekLyric(currentTime * 1000);
      }
    }
  }

  // 控制音量
  onVolumeChange(per: number) {
    this.audioEl.volume = per / 100;
  }

  // 上一曲
  onPrev(index: number) {
    if (!this.songReady) {
      return;
    } else if (this.playList.length === 1) {
      this.loop();
    } else {
      const newIndex = index < 0 ? this.playList.length - 1 : index;
      this.updateIndex(newIndex);
    }
  }

  // 下一曲
  onNext(index: number) {
    if (!this.songReady) {
      return;
    } else if (this.playList.length === 1) {
      this.loop();
    } else {
      const newIndex = index >= this.playList.length ? 0 : index;
      this.updateIndex(newIndex);
    }
  }

  // 单曲循环
  private loop() {
    this.audioEl.currentTime = 0;
    this.play();
    if (this.playPanel) {
      this.playPanel.seekLyric(0);
    }
  }

  private updateIndex(newIndex: number) {
    this.store$.dispatch(SetCurrentIndex({ currentIndex: newIndex }));
    this.songReady = false;
  }

  // 播放暂停
  onToggle() {
    if (!this.currentSong) {
      if (this.playList.length) {
        this.updateIndex(0);
      }
    } else {
      if (this.songReady) {
        this.playing = !this.playing;
        if (this.playing) {
          this.audioEl.play();
        } else {
          this.audioEl.pause();
        }
      }
    }
  }

  // 更新播放时间
  onTimeUptate(e: Event) {
    this.currentTime = (e.target as HTMLAudioElement).currentTime;
    this.percent = (this.currentTime / this.duration) * 100;
    const buffered = this.audioEl.buffered;
    if (buffered.length && this.bufferPercent < 100) {
      this.bufferPercent = (buffered.end(0) / this.duration) * 100;
    }
  }

  // 准备播放
  onCanPlay() {
    this.songReady = true;
    this.play();
  }

  private play() {
    this.audioEl.play();
    this.playing = true;
  }

  // 歌曲结束
  onEnded() {
    this.playing = false;
    if (this.currentMode.type === 'singleLoop') {
      this.loop();
    } else {
      this.onNext(this.currentIndex + 1);
    }
  }

  // 播放错误
  onError() {
    this.playing = false;
    this.bufferPercent = 0;
  }

  // 通过播放列表切换歌曲
  onChangeSong(song: Song) {
    this.updateCurrentIndex(this.playList, song);
  }

  get picUrl(): string {
    return this.currentSong ? this.currentSong.al.picUrl : 'http://s4.music.126.net/style/web2/img/default/default_album.jpg';
  }

  // 删除歌曲
  onDeleteSong(song: Song) {
    this.batchActionsServe.deleteSong(song);
  }

  // 清空歌曲
  onClearSongList() {
    this.nzModalServe.confirm({
      nzTitle: '确认清空列表？',
      nzOnOk: () => {
        this.batchActionsServe.clearSongList();
      }
    });
  }

  onClickOutSide(target: HTMLElement) {
    if (target.dataset.act !== 'delete') {
      this.showVolumePanel = false;
      this.showListPanel = false;
      this.bingFlag = false;
    }
  }

  toInfo(path: [string, number]) {
    if (path[1]) {
      this.showListPanel = false;
      this.showVolumePanel = false;
      this.router.navigate(path);
    }
  }

  togglePlayer(type: string) {
    if (!this.isLocked && !this.animating) {
      this.showPlayer = type;
    }
  }

}
