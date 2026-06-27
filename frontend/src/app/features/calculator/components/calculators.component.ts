import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CalculatorService } from '../services/calculator.service';

type CalculatorTab = 'freight' | 'volumetric' | 'customs' | 'storage';

@Component({
  selector: 'app-calculators',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './calculators.component.html',
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class CalculatorsComponent {
  readonly calcService = inject(CalculatorService);
  
  activeTab = signal<CalculatorTab>('freight');
  
  selectedRateName = signal('');
  selectedRateCost = signal(0);

  updateOrigin(e: Event) {
    this.calcService.updateInputs({ origin: (e.target as HTMLInputElement).value });
  }

  updateDestination(e: Event) {
    this.calcService.updateInputs({ destination: (e.target as HTMLInputElement).value });
  }

  updateLength(e: Event) {
    this.calcService.updateInputs({ length: parseInt((e.target as HTMLInputElement).value) || 0 });
  }

  updateWidth(e: Event) {
    this.calcService.updateInputs({ width: parseInt((e.target as HTMLInputElement).value) || 0 });
  }

  updateHeight(e: Event) {
    this.calcService.updateInputs({ height: parseInt((e.target as HTMLInputElement).value) || 0 });
  }

  updateWeight(e: Event) {
    this.calcService.updateInputs({ weight: parseFloat((e.target as HTMLInputElement).value) || 0 });
  }

  triggerCalculation() {
    this.calcService.calculateRates();
  }

  selectRecommendation(name: string, cost: number) {
    this.selectedRateName.set(name);
    this.selectedRateCost.set(cost);
  }
}
