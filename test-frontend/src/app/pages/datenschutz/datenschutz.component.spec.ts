import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatenschutzComponent } from './datenschutz.component';

describe('DatenschutzComponent', () => {
  let component: DatenschutzComponent;
  let fixture: ComponentFixture<DatenschutzComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatenschutzComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DatenschutzComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
