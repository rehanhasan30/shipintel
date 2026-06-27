import { TestBed, ComponentFixture } from '@angular/core/testing';
import { CalculatorsComponent } from './calculators.component';
import { CalculatorService } from '../services/calculator.service';
import { signal, computed } from '@angular/core';

describe('CalculatorsComponent', () => {
  let component: CalculatorsComponent;
  let fixture: ComponentFixture<CalculatorsComponent>;
  let mockCalculatorService: any;

  beforeEach(async () => {
    mockCalculatorService = {
      origin: signal('Shanghai'),
      destination: signal('Los Angeles'),
      length: signal(50),
      width: signal(40),
      height: signal(30),
      weight: signal(10),
      service: signal('standard'),
      volumetricWeight: signal(12),
      chargeableWeight: signal(12),
      recommendations: signal([]),
      loading: signal(false),
      error: signal(null),
      estimatedLowestCost: signal(0),
      updateInputs: jasmine.createSpy('updateInputs'),
      calculateRates: jasmine.createSpy('calculateRates')
    };

    await TestBed.configureTestingModule({
      imports: [CalculatorsComponent],
      providers: [
        { provide: CalculatorService, useValue: mockCalculatorService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CalculatorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should trigger calculation on service when triggerCalculation is called', () => {
    component.triggerCalculation();
    expect(mockCalculatorService.calculateRates).toHaveBeenCalled();
  });

  it('should select rate recommendation and display selection state', () => {
    component.selectRecommendation('Carrier A', 150);
    expect(component.selectedRateName()).toBe('Carrier A');
    expect(component.selectedRateCost()).toBe(150);
  });
});
