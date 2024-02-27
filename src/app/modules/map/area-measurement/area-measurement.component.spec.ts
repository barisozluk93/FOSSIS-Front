import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AreaMeasurementComponent } from './area-measurement.component';

describe('ToolbarComponent', () => {
  let component: AreaMeasurementComponent;
  let fixture: ComponentFixture<AreaMeasurementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AreaMeasurementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AreaMeasurementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
