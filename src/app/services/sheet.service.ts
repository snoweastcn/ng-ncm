import { Injectable, Inject } from '@angular/core';
import { HttpParams, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/internal/operators';
import { ServicesModule, API_CONFIG } from './services.module';
import { SongSheet } from './data-types/common.types';



@Injectable({
  providedIn: ServicesModule
})
export class SheetService {

  constructor(private http: HttpClient, @Inject(API_CONFIG) private uri: string) { }

  getSongSheetDetail(id: number): Observable<SongSheet[]> {
    const params = new HttpParams().set('id', id.toString());
    // const params = new HttpParams({ fromString: queryString.stringify(args) })
    return this.http.get(`${this.uri}/playlist/detail`, { params }).pipe(
      map((res: { playlist: SongSheet[] }) => res.playlist)
    );
  }

}
