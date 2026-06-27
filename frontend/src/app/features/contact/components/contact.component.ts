import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpService, ApiResponse } from '../../../core/http/http.service';
import { API_CONSTANTS } from '../../../core/constants/api.constants';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.component.html',
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class ContactComponent {
  private readonly _httpService = inject(HttpService);

  formName = '';
  formEmail = '';
  formSubject = '';
  formMessage = '';

  isSubmitted = signal(false);
  sending = signal(false);
  error = signal<string | null>(null);

  onSubmit(e: Event) {
    e.preventDefault();
    if (!this.formName || !this.formEmail || !this.formSubject || !this.formMessage) return;
    
    this.sending.set(true);
    this.error.set(null);

    const payload = {
      name: this.formName,
      email: this.formEmail,
      subject: this.formSubject,
      message: this.formMessage
    };

    this._httpService.post<unknown>(API_CONSTANTS.CONTACT_SUPPORT, payload).subscribe({
      next: (res: ApiResponse<unknown>) => {
        if (res.success) {
          this.isSubmitted.set(true);
        } else {
          this.error.set(res.message);
        }
        this.sending.set(false);
      },
      error: (err: Error) => {
        this.error.set(err.message);
        this.sending.set(false);
      }
    });
  }

  resetForm() {
    this.formName = '';
    this.formEmail = '';
    this.formSubject = '';
    this.formMessage = '';
    this.isSubmitted.set(false);
    this.error.set(null);
  }
}
