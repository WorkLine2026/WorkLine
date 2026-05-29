import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonProfile } from './person-profile';

describe('PersonProfile', () => {
  let component: PersonProfile;
  let fixture: ComponentFixture<PersonProfile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonProfile]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonProfile);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
