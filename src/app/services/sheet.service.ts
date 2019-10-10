import { Injectable, Inject } from '@angular/core';
import { HttpParams, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, pluck, switchMap, tap } from 'rxjs/internal/operators';
import { ServicesModule, API_CONFIG } from './services.module';
import { SongSheet, Song } from './data-types/common.types';
import { SongService } from './song.service';



@Injectable({
  providedIn: ServicesModule
})
export class SheetService {

  constructor(
    private http: HttpClient,
    @Inject(API_CONFIG) private uri: string,
    private songServe: SongService
  ) { }

  getSongSheetDetail(id: number): Observable<SongSheet[]> {
    const params = new HttpParams().set('id', id.toString());
    return this.http.get(`${this.uri}/playlist/detail`, { params }).pipe(
      map((res: { playlist: SongSheet[] }) => res.playlist)
    );
  }


  playSheet(id: number) {
    return this.getSongSheetDetail(id).pipe(
      pluck('tracks'),
      switchMap((tracks: Song | Song[]) => this.songServe.getSongList(tracks))
    );
  }


}
