import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ContactComponent } from './contact.component';
import { HttpService, ApiResponse } from '../../../core/http/http.service';
import { of } from 'rxjs';

describe('ContactComponent', () => {
  let component: ContactComponent;
  let fixture: ComponentFixture<ContactComponent>;
  let mockHttpService: any;

  beforeEach(async () => {
    mockHttpService = jasmine.createSpyObj('HttpService', ['post']);

    await TestBed.configureTestingModule({
      imports: [ContactComponent],
      providers: [
        { provide: HttpService, useValue: mockHttpService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should submit support ticket details successfully', () => {
    const mockResponse: ApiResponse<any> = {
      success: true,
      message: 'Support ticket generated',
      data: {},
      timestamp: new Date().toISOString()
    };
    mockHttpService.post.and.returnValue(of(mockResponse));

    component.formName = 'Test User';
    component.formEmail = 'test@example.com';
    component.formSubject = 'Test Subject';
    component.formMessage = 'Test message contents...';

    component.onSubmit({ preventDefault: () => {} } as Event);

    expect(mockHttpService.post).toHaveBeenCalled();
    expect(component.isSubmitted()).toBeTrue();
    expect(component.sending()).toBeFalse();
  });
});
