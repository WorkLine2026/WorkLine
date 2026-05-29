import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistercompanyComponent } from './registercompany';

describe('Registercompany', () => {
  let component: RegistercompanyComponent;
  let fixture: ComponentFixture<RegistercompanyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistercompanyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistercompanyComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
