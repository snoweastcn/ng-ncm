import { Injectable, Inject } from '@angular/core';
import { ServicesModule, API_CONFIG } from './services.module';
import { Observable } from 'rxjs';
import { map } from 'rxjs/internal/operators';
import { HttpClient } from '@angular/common/http';
import { LoginParams } from '../share/nc-ui/nc-layer/nc-layer-login/nc-layer-login.component';
import { User, Signin } from './data-types/member.type';
import { SampleBack } from './data-types/common.types';

@Injectable({
  providedIn: ServicesModule
})
export class MemberService {

  constructor(private http: HttpClient, @Inject(API_CONFIG) private uri: string) { }

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

}
