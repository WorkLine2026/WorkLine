import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Forbusisness } from './forbusisness';

describe('Forbusisness', () => {
  let component: Forbusisness;
  let fixture: ComponentFixture<Forbusisness>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Forbusisness]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Forbusisness);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
