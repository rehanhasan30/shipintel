import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private _activeRequests = 0;
  readonly isLoading = signal(false);

  show() {
    this._activeRequests++;
    this.isLoading.set(true);
  }

  hide() {
    this._activeRequests--;
    if (this._activeRequests <= 0) {
      this._activeRequests = 0;
      this.isLoading.set(false);
    }
  }
}
