import { Injectable, Inject } from '@angular/core';
import { HttpParams, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, pluck, switchMap } from 'rxjs/internal/operators';
import { ServicesModule, API_CONFIG } from './services.module';
import { SongSheet, Song, SheetList } from './data-types/common.types';
import { SongService } from './song.service';
import { Params } from '@angular/router';

export interface SheetParams extends Params {
  offset: number;
  limit: number;
  order: 'new' | 'hot';
  cat: string;
}

@Injectable({
  providedIn: ServicesModule
})
export class SheetService {

  constructor(
    private http: HttpClient,
    @Inject(API_CONFIG) private uri: string,
    private songServe: SongService
  ) { }

  // 歌单列表
  getSheets(args: SheetParams): Observable<SheetList> {
    return this.http.get(`${this.uri}/top/playlist`, { params: args }).pipe(map(res => res as SheetList));
  }

  // 歌单详情
  getSongSheetDetail(id: number): Observable<SongSheet> {
    const params = new HttpParams().set('id', id.toString());
    return this.http.get(`${this.uri}/playlist/detail`, { params }).pipe(
      map((res: { playlist: SongSheet }) => res.playlist)
    );
  }


  playSheet(id: number) {
    return this.getSongSheetDetail(id).pipe(
      pluck('tracks'),
      switchMap((tracks: Song | Song[]) => this.songServe.getSongList(tracks))
    );
  }


}
