import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationWithInvitationComponent } from './registration-with-invitation.component';

describe('RegistrationWithInvitationComponent', () => {
  let component: RegistrationWithInvitationComponent;
  let fixture: ComponentFixture<RegistrationWithInvitationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegistrationWithInvitationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistrationWithInvitationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
