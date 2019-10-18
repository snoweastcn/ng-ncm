import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
  ViewChildren,
  QueryList,
  Inject,
} from '@angular/core';
import { Song } from 'src/app/services/data-types/common.types';
import { NcScrollComponent } from '../nc-scroll/nc-scroll.component';
import { findIndex } from 'src/app/utils/array';
import { timer } from 'rxjs';
import { WINDOW } from 'src/app/services/services.module';
import { SongService } from 'src/app/services/song.service';
import { NcLyric, BaseLyricLine } from './nc-lyric';

@Component({
  selector: 'app-nc-player-panel',
  templateUrl: './nc-player-panel.component.html',
  styleUrls: ['./nc-player-panel.component.less']
})
export class NcPlayerPanelComponent implements OnInit, OnChanges {

  @Input() songList: Song[];
  @Input() currentSong: Song;
  @Input() show: boolean;
  @Input() playing: boolean;

  @Output() handleClose = new EventEmitter<void>();
  @Output() changeSong = new EventEmitter<Song>();
  @Output() deleteSong = new EventEmitter<Song>();
  @Output() clearSongList = new EventEmitter<void>();
  @Output() toInfoEvent = new EventEmitter<[string, number]>();
  @Output() likeSong = new EventEmitter<string>();
  @Output() shareSong = new EventEmitter<Song>();

  @ViewChildren(NcScrollComponent) private ncScroll: QueryList<NcScrollComponent>;

  currentIndex: number;
  scrollY = 0;

  currentLyric: BaseLyricLine[];

  private lyric: NcLyric;

  currentLineNum: number;

  private lyricRefs: NodeList;

  private startLine = 2;

  constructor(@Inject(WINDOW) private win: Window, private songServe: SongService) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.playing) {
      if (!changes.playing.firstChange) {
        if (this.lyric) {
          this.lyric.togglePaly(this.playing);
        }
      }
    }

    if (changes.songList) {
      if (this.currentSong) {
        this.updateCurrentIndex();
      }
    }

    if (changes.currentSong) {
      this.updateCurrentIndex();
      if (this.currentSong) {
        this.updateLyric();
        if (this.show) {
          this.scrollToCurrent();
        }
      } else {
        this.resetLyric();
      }
    }

    if (changes.show) {
      if (!changes.show.firstChange && this.show) {
        this.ncScroll.first.refreshScroll();
        this.ncScroll.last.refreshScroll();
        timer(80).subscribe(() => {
          if (this.currentSong) {
            this.scrollToCurrent(0);
          }
          if (this.lyricRefs) {
            this.scrollToCurrentLyric(0);
          }
        });

        // this.win.setTimeout(() => {
        //   if (this.currentSong) {
        //     this.scrollToCurrent(0);
        //   }
        // }, 80);
      }
    }
  }

  private scrollToCurrent(speed = 300) {
    const songListRefs = this.ncScroll.first.el.nativeElement.querySelectorAll('ul li');
    if (songListRefs.length) {
      const currentLi = songListRefs[this.currentIndex || 0] as HTMLElement;
      const offsetTop = currentLi.offsetTop;
      const offsetHeight = currentLi.offsetHeight;
      if (((offsetTop - Math.abs(this.scrollY)) > offsetHeight * 5) || (offsetTop < Math.abs(this.scrollY))) {
        this.ncScroll.first.scrollToElement(currentLi, speed, false, false);
      }
    }
  }

  private scrollToCurrentLyric(speed = 300) {
    const targetLine = this.lyricRefs[this.currentLineNum - this.startLine];
    if (targetLine) {
      this.ncScroll.last.scrollToElement(targetLine, speed, false, false);
    }
  }

  private updateCurrentIndex() {
    this.currentIndex = findIndex(this.songList, this.currentSong);
  }

  private updateLyric() {
    this.resetLyric();
    this.songServe.getLyric(this.currentSong.id).subscribe(res => {
      this.lyric = new NcLyric(res);
      this.currentLyric = this.lyric.lines;

      this.startLine = res.tlyric ? 1 : 3;
      this.handleLyric();

      this.ncScroll.last.scrollTo(0, 0);
      if (this.playing) {
        this.lyric.play();
      }
    });
  }

  private handleLyric() {
    this.lyric.handler.subscribe(({ lineNum }) => {
      if (!this.lyricRefs) {
        this.lyricRefs = this.ncScroll.last.el.nativeElement.querySelectorAll('ul li');
      }
      if (this.lyricRefs.length) {
        this.currentLineNum = lineNum;
        if (lineNum > this.startLine) {
          this.scrollToCurrentLyric(300);
        } else {
          this.ncScroll.last.scrollTo(0, 0);
        }
      }
    });
  }

  private resetLyric() {
    if (this.lyric) {
      this.lyric.stop();
      this.lyric = null;
      this.currentLyric = [];
      this.currentLineNum = 0;
      this.lyricRefs = null;
    }
  }

  seekLyric(time: number) {
    if (this.lyric) {
      this.lyric.seek(time);
    }
  }

  toInfo(evt: MouseEvent, path: [string, number]) {
    evt.stopPropagation();
    this.toInfoEvent.emit(path);
  }

  toLikeSong(evt: MouseEvent, id: string) {
    evt.stopPropagation();
    this.likeSong.emit(id);
  }

  toShareSong(evt: MouseEvent, song: Song) {
    evt.stopPropagation();
    this.shareSong.emit(song);
  }

}
