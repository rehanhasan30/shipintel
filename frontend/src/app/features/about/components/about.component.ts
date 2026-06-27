import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [],
  templateUrl: './about.component.html',
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class AboutComponent {
  readDocs() {
    alert("Bypassing to Developer Docs API Hub. Complete reference available soon.");
  }
}
