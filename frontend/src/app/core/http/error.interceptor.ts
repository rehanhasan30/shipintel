import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, throwError } from 'rxjs';

/**
 * Functional HTTP Interceptor for Global Error Handling.
 * Formats errors, displays a toast snackbar notification, and logs details to console.
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const snackBar = inject(MatSnackBar);

  return next(req).pipe(
    catchError((err) => {
      let customErrorMessage = 'Failed to establish connection with server gateway.';
      
      if (err.error && typeof err.error === 'object' && 'message' in err.error) {
        customErrorMessage = err.error.message;
      } else if (err.message) {
        customErrorMessage = err.message;
      }
      
      console.error(`[HTTP Error ${err.status || 'Unknown'}]:`, customErrorMessage);
      
      // Display global snackbar notification toast
      snackBar.open(customErrorMessage, 'Dismiss', {
        duration: 5000,
        horizontalPosition: 'right',
        verticalPosition: 'bottom',
        panelClass: ['error-snackbar']
      });

      return throwError(() => new Error(customErrorMessage));
    })
  );
};
