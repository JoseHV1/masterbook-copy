import { Component } from '@angular/core';

@Component({
  selector: 'app-register-lead',
  templateUrl: './register-lead.component.html',
  styleUrls: ['./register-lead.component.scss'],
})
export class RegisterLeadComponent {
  readonly defaultLogo = '/assets/images/logo.svg';
  agencyLogoUrl: string | null = null;
}
