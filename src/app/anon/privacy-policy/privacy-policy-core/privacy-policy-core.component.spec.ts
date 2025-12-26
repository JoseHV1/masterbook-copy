import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivacyPolicyCoreComponent } from './privacy-policy-core.component';

describe('PrivacyPolicyCoreComponent', () => {
  let component: PrivacyPolicyCoreComponent;
  let fixture: ComponentFixture<PrivacyPolicyCoreComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PrivacyPolicyCoreComponent],
    });
    fixture = TestBed.createComponent(PrivacyPolicyCoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
