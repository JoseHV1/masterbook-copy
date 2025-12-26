import { Component } from '@angular/core';
import { NotificationModel } from './notifications-models';
import { TooltipOptions } from 'primeng/tooltip';

@Component({
  selector: 'app-portal-navbar-notification',
  templateUrl: './portal-navbar-notification.component.html',
  styleUrls: ['./portal-navbar-notification.component.scss'],
})
export class PortalNavbarNotificationComponent {
  tooltipOptions: TooltipOptions = {
    showDelay: 120,
    autoHide: false,
    tooltipEvent: 'hover',
    tooltipPosition: 'top',
  };

  notifications: NotificationModel[] = [
    {
      title: 'holitas tuuuuu',
      timestamp: '2 minutes ago',
      status: 'pending',
    },
    {
      title: 'debe pagar lo que debe de su policies',
      timestamp: '2 minutes ago',
      status: 'pending',
    },
    {
      title: 'pagar lo que debe de su policies otra vez',
      timestamp: '2 minutes ago',
      status: 'reading',
    },
  ];
}
