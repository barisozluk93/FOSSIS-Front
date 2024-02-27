import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GoToCoordinateComponent } from './gotocoordinate.component';

describe('ToolbarComponent', () => {
  let component: GoToCoordinateComponent;
  let fixture: ComponentFixture<GoToCoordinateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GoToCoordinateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GoToCoordinateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
