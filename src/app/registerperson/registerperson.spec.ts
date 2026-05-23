import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Registerperson } from './registerperson';

describe('Registerperson', () => {
  let component: Registerperson;
  let fixture: ComponentFixture<Registerperson>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Registerperson]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Registerperson);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
