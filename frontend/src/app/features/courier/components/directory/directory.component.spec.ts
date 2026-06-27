import { TestBed, ComponentFixture } from '@angular/core/testing';
import { DirectoryComponent } from './directory.component';
import { CourierService } from '../../services/courier.service';
import { signal } from '@angular/core';
import { provideRouter } from '@angular/router';

describe('DirectoryComponent', () => {
  let component: DirectoryComponent;
  let fixture: ComponentFixture<DirectoryComponent>;
  let mockCourierService: any;

  beforeEach(async () => {
    mockCourierService = {
      searchQuery: signal(''),
      filterCoverage: signal('All'),
      filterMode: signal('All'),
      filterRating: signal('Any'),
      filteredCouriers: signal([
        { id: '1', name: 'Test Courier 1', rating: 4.8, modes: ['Air'], coverage: ['APAC'], tags: [] },
        { id: '2', name: 'Test Courier 2', rating: 4.5, modes: ['Ground'], coverage: ['EU'], tags: [] }
      ]),
      loading: signal(false),
      error: signal(null),
      isEmpty: signal(false),
      loadCouriers: jasmine.createSpy('loadCouriers')
    };

    await TestBed.configureTestingModule({
      imports: [DirectoryComponent],
      providers: [
        { provide: CourierService, useValue: mockCourierService },
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DirectoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call loadCouriers on initialization', () => {
    expect(mockCourierService.loadCouriers).toHaveBeenCalled();
  });

  it('should update filters when input events fire', () => {
    const inputElement = document.createElement('input');
    inputElement.value = 'DHL';
    const mockEvent = { target: inputElement } as unknown as Event;

    component.updateSearch(mockEvent);
    expect(mockCourierService.searchQuery()).toBe('DHL');
  });
});
