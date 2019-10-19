import { Injectable, Inject } from '@angular/core';
import { ServicesModule, API_CONFIG } from './services.module';
import { Observable } from 'rxjs';
import { map } from 'rxjs/internal/operators';
import { HttpClient } from '@angular/common/http';
import { LoginParams } from '../share/nc-ui/nc-layer/nc-layer-login/nc-layer-login.component';
import { User, Signin, RecordVal, UserRecord, UserSheet } from './data-types/member.type';
import { SampleBack, SongSheet } from './data-types/common.types';
import { Params } from '@angular/router';

export enum RecordType {
  allData,
  weekData
}

export interface LikeSongParams extends Params {
  pid: string;
  tracks: string;
}


export interface ShareParams {
  id: string;
  msg: string;
  type: string;
}

export interface RecordParams extends Params {
  uid: string;
  type?: any;
}

@Injectable({
  providedIn: ServicesModule
})
export class MemberService {

  constructor(private http: HttpClient, @Inject(API_CONFIG) private uri: string) { }

  // 登录
  login(formValue: LoginParams): Observable<User> {
    return this.http.get(`${this.uri}/login/cellphone`, { params: formValue }).pipe(
      map(res => res as User)
    );
  }

  // 获取用户详情
  getUserDetail(uid: string): Observable<User> {
    return this.http.get(`${this.uri}/user/detail`, { params: { uid } }).pipe(map(res => res as User));
  }

  // 退出
  logout(): Observable<SampleBack> {
    return this.http.get(`${this.uri}/logout`).pipe(map(res => res as SampleBack));
  }

  // 签到
  signin(): Observable<Signin> {
    return this.http.get(`${this.uri}/daily_signin`, { params: { type: '1' } }).pipe(map(res => res as Signin));
  }

  // 听歌记录
  getUserRecord({ uid, type = RecordType.weekData }: RecordParams): Observable<RecordVal[]> {
    return this.http.get(`${this.uri}/user/record`, { params: { uid, type } }).pipe(
      map((res: UserRecord) => res[RecordType[type]])
    );
  }

  // 用户歌单
  getUserSheets(uid: string): Observable<UserSheet> {
    return this.http.get(`${this.uri}/user/playlist`, { params: { uid } }).pipe(
      map((res: { playlist: SongSheet[] }) => {
        const list = res.playlist;
        return {
          self: list.filter(item => !item.subscribed),
          subscribed: list.filter(item => item.subscribed)
        };
      })
    );
  }

  // 新建歌单
  createSheet(name: string): Observable<string> {
    return this.http.get(`${this.uri}/playlist/create`, { params: { name } }).pipe(map((res: SampleBack) => res.id.toString()));
  }

  // 收藏歌单
  likeSheet({ id, t = 1 }: Params): Observable<number> {
    return this.http.get(`${this.uri}/playlist/subscribe`, { params: { id, t } }).pipe(map((res: SampleBack) => res.code));
  }

  // 收藏歌曲
  likeSong({ pid, tracks }: LikeSongParams): Observable<number> {
    return this.http.get(`${this.uri}/playlist/tracks`, { params: { pid, tracks, op: 'add' } }).pipe(map((res: SampleBack) => res.code));
  }

  // 分享
  shareResource({ id, msg, type }: ShareParams): Observable<number> {
    return this.http.get(`${this.uri}/share/resource`, { params: { id, msg, type } }).pipe(map((res: SampleBack) => res.code));
  }

  // 收藏歌手
  likeSinger({ id, t = 1 }: Params): Observable<number> {
    return this.http.get(`${this.uri}/artist/sub`, { params: { id, t } }).pipe(map((res: SampleBack) => res.code));
  }

  // 发送验证码
  sendCode(phone: string): Observable<number> {
    return this.http.get(`${this.uri}/captcha/sent`, { params: { phone } }).pipe(map((res: SampleBack) => res.code));
  }

  // 验证验证码
  checkCode(phone: string, captcha: string): Observable<number> {
    return this.http.get(`${this.uri}/captcha/verify`, { params: { phone, captcha } }).pipe(map((res: SampleBack) => res.code));
  }

  // 是否已注册
  checkExist(phone: string): Observable<number> {
    return this.http.get(`${this.uri}/cellphone/existence/check`, { params: { phone } }).pipe(map((res: { exist: number }) => res.exist));
  }

}
