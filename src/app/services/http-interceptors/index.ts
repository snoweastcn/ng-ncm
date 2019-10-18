import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { CommonIntercepotor } from './common.interceptor';

export const httpInterceptorProvides = [
  { provide: HTTP_INTERCEPTORS, useClass: CommonIntercepotor, multi: true }
];
