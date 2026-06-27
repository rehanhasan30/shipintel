import { HttpInterceptorFn } from '@angular/common/http';
import { tap } from 'rxjs';
import { environment } from '../../../environments/environment';

/**
 * Functional HTTP Interceptor for Request/Response Logging.
 * Runs in non-production environments only.
 */
export const loggingInterceptor: HttpInterceptorFn = (req, next) => {
  if (environment.production) {
    return next(req);
  }
  
  const startTime = Date.now();
  console.log(`[HTTP Outgoing] ${req.method} -> ${req.url}`);
  
  return next(req).pipe(
    tap({
      next: () => {
        const elapsed = Date.now() - startTime;
        console.log(`[HTTP Incoming] ${req.method} <- ${req.url} (Success in ${elapsed}ms)`);
      },
      error: (err) => {
        const elapsed = Date.now() - startTime;
        console.warn(`[HTTP Incoming] ${req.method} <- ${req.url} (Failed in ${elapsed}ms):`, err);
      }
    })
  );
};
