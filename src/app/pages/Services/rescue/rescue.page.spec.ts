import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RescuePage } from './rescue.page';

describe('RescuePage', () => {
  let component: RescuePage;
  let fixture: ComponentFixture<RescuePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(RescuePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
