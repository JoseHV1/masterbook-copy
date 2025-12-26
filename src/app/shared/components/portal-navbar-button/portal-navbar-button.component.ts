import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-portal-navbar-button',
  templateUrl: './portal-navbar-button.component.html',
  styleUrls: ['./portal-navbar-button.component.scss'],
})
export class PortalNavbarButtonComponent {
  @Input() icon!: string;
  @Input() badge: boolean = false;
  @Input() quantityNotification!: number;
}
