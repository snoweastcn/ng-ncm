import { NgModule, InjectionToken } from '@angular/core';
import { CommonModule } from '@angular/common';
import { httpInterceptorProvides } from './http-interceptors';
import { environment } from 'src/environments/environment';

export const API_CONFIG = new InjectionToken('ApiConfigToken');

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    { provide: API_CONFIG, useValue: environment.production ? '/' : '/api' },
    httpInterceptorProvides
  ]
})
export class ServicesModule { }
