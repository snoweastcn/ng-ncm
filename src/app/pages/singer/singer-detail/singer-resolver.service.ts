import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable, forkJoin } from 'rxjs';
import { SingerDetail, Singer } from '../../../services/data-types/common.types';
import { SingerService } from '../../../services/singer.service';
import { first, catchError } from 'rxjs/internal/operators';
import { NzMessageService } from 'ng-zorro-antd';

type SingerDetailDataModel = [SingerDetail, Singer[]];

@Injectable()
export class SingerResolverService implements Resolve<SingerDetailDataModel> {

  constructor(private singerServe: SingerService, private nzMessageServe: NzMessageService) { }

  resolve(route: ActivatedRouteSnapshot): Observable<SingerDetailDataModel> {
    const id = route.paramMap.get('id');
    return forkJoin([
      this.singerServe.getSingerDetail(id),
      this.singerServe.getSimiSinger(id)
    ]).pipe(
      first(),
      catchError(error => {
        this.alertMessage('warning', error.msg); return [];
      })
    );
  }

  private alertMessage(type: string, msg: string) {
    this.nzMessageServe.create(type, msg);
  }
}
