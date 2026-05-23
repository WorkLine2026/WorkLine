import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Registercompany } from './registercompany';

describe('Registercompany', () => {
  let component: Registercompany;
  let fixture: ComponentFixture<Registercompany>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Registercompany]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Registercompany);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
