import { Component, OnInit, ChangeDetectionStrategy, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { SongSheet } from 'src/app/services/data-types/common.types';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LikeSongParams } from 'src/app/services/member.service';
import { timer } from 'rxjs';

@Component({
  selector: 'app-nc-layer-like',
  templateUrl: './nc-layer-like.component.html',
  styleUrls: ['./nc-layer-like.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NcLayerLikeComponent implements OnInit, OnChanges {
  @Input() mySheets: SongSheet[];
  @Input() visible: boolean;
  @Input() likeId: string;

  @Output() likeSong = new EventEmitter<LikeSongParams>();
  @Output() createSheet = new EventEmitter<string>();

  creating = false;
  formModel: FormGroup;
  constructor(
    private fb: FormBuilder,
  ) {
    this.formModel = this.fb.group({
      sheetName: ['', [Validators.required]]
    });
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.visible) {
      if (!this.visible) {
        // this.formModel.get('sheetName').setValue('');
        timer(500).subscribe(() => {
          this.formModel.get('sheetName').reset();
          this.creating = false;
        });
      }
    }
  }

  onLike(pid: string) {
    this.likeSong.emit({ pid, tracks: this.likeId });
  }

  onSubmit() {
    this.createSheet.emit(this.formModel.get('sheetName').value);
  }

}
