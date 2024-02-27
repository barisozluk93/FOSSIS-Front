import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LengthMeasurementComponent } from './length-measurement.component';

describe('ToolbarComponent', () => {
  let component: LengthMeasurementComponent;
  let fixture: ComponentFixture<LengthMeasurementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LengthMeasurementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LengthMeasurementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
