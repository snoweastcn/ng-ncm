import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
  ViewChildren,
  QueryList
} from '@angular/core';
import { Song } from 'src/app/services/data-types/common.types';
import { NcScrollComponent } from '../nc-scroll/nc-scroll.component';

@Component({
  selector: 'app-nc-player-panel',
  templateUrl: './nc-player-panel.component.html',
  styleUrls: ['./nc-player-panel.component.less']
})
export class NcPlayerPanelComponent implements OnInit, OnChanges {

  @Input() songList: Song[];
  @Input() currentSong: Song;
  @Input() currentIndex: number;
  @Input() show: boolean;

  @Output() handleClose = new EventEmitter<void>();
  @Output() changeSong = new EventEmitter<Song>();

  @ViewChildren(NcScrollComponent) private ncScroll: QueryList<NcScrollComponent>;

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    const songList = 'songList';
    const currentSong = 'currentSong';
    if (changes[songList]) {

    }
    if (changes[currentSong]) {

    }
    if (changes.show) {
      if (!changes.show.firstChange && this.show) {
        console.log(this.ncScroll);
        this.ncScroll.first.refreshScroll();
      }
    }
  }

}
