import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvitePolicyHolderComponent } from './invite-policy-holder.component';

describe('InvitePolicyHolderComponent', () => {
  let component: InvitePolicyHolderComponent;
  let fixture: ComponentFixture<InvitePolicyHolderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InvitePolicyHolderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InvitePolicyHolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
