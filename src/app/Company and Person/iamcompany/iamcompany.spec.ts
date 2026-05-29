import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Iamcompany } from './iamcompany';

describe('Iamcompany', () => {
  let component: Iamcompany;
  let fixture: ComponentFixture<Iamcompany>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Iamcompany]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Iamcompany);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
