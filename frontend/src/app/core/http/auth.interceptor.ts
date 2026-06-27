import { HttpInterceptorFn } from '@angular/common/http';

/**
 * Functional HTTP Interceptor for Authentication.
 * Automatically injects the JWT access token from LocalStorage if active.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('jwt_token');
  if (token) {
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    return next(authReq);
  }
  return next(req);
};
