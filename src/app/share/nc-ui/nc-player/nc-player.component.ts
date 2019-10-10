import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppStoreModule } from 'src/app/store';
import { getSongList, getPlayList, getCurrentIndex, getPlayMode, getCurrentSong } from 'src/app/store/selectors/player.selector';
import { Song } from 'src/app/services/data-types/common.types';
import { PlayMode } from './player-type';
import { SetCurrentIndex } from 'src/app/store/actions/player.action';

@Component({
  selector: 'app-nc-player',
  templateUrl: './nc-player.component.html',
  styleUrls: ['./nc-player.component.less']
})
export class NcPlayerComponent implements OnInit, AfterViewInit {
  @ViewChild('audio', { static: true }) private audio: ElementRef;
  private audioEl: HTMLAudioElement;
  percent = 0;
  bufferPercent = 0;

  songList: Song[];
  playList: Song[];
  currentIndex: number;
  playMode: PlayMode;
  currentSong: Song;

  duration: number;
  currentTime: number;

  // 播放状态
  playing = false;
  // 是否可以播放
  songReady = false;

  constructor(
    private store$: Store<AppStoreModule>
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
    this.playMode = playMode;
  }

  private watchCurrentSong(currentSong: Song) {
    if (currentSong) {
      this.currentSong = currentSong;
      this.duration = currentSong.dt / 1000;
    }
  }

  onPercentChange(per) {
    this.audioEl.currentTime = this.duration * (per / 100);
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

  get picUrl(): string {
    return this.currentSong ? this.currentSong.al.picUrl : 'http://s4.music.126.net/style/web2/img/default/default_album.jpg';
  }

}
