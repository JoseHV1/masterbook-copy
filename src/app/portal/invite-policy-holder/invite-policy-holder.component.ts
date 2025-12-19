import { Component } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms'; // Import FormBuilder and Validators
import { DataService } from './invite-policy-holder.service';

@Component({
  selector: 'app-invite-policy-holder',
  templateUrl: './invite-policy-holder.component.html',
  styleUrls: ['./invite-policy-holder.component.scss'],
})
export class InvitePolicyHolderComponent {
  breadcrumbItems = [
    { label: 'Home', routerLink: '/' },
    { label: 'Invite Policy Holder', routerLink: '/your-component' },
  ];
  pageTitle: string = 'Invite a Policy Holder';
  policyHolderEmail: string = '';
  emailFormControl: FormControl;

  constructor(
    private dataService: DataService,
    private formBuilder: FormBuilder
  ) {
    this.emailFormControl = new FormControl('', [
      Validators.required,
      Validators.email,
    ]); // Initialize as FormControl
  }

  sendInvitation() {
    if (this.emailFormControl.valid) {
      this.dataService
        .sendInvitation(this.emailFormControl.value)
        .then(response => {
          // Handle success - show success message, etc.
        })
        .catch(error => {
          console.error('Error sending invitation:', error);
          // Handle error - show error message, etc.
        });
    }
  }

  // Helper function to check if the email field is invalid
  fieldInvalid(): boolean {
    return (
      this.emailFormControl.invalid &&
      (this.emailFormControl.dirty || this.emailFormControl.touched)
    );
  }
}
