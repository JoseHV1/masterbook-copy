import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { brokerRolesDataset } from '@app/shared/datatsets/roles.datasets';
import { RolesEnum } from '@app/shared/enums/roles.enum';
import { AuthService } from '@app/shared/services/auth.service';
import { Subscription } from 'rxjs';
import { NotificationStatusEnum } from 'src/app/shared/enums/notification-status.enum';
import { NotificationModel } from 'src/app/shared/interfaces/models/notification.model';
import { NotificationsService } from 'src/app/shared/services/notifications.service';
import { UiService } from 'src/app/shared/services/ui.service';

@Component({
  selector: 'app-internal-navbar-notifications',
  templateUrl: './internal-navbar-notifications.component.html',
  styleUrls: ['./internal-navbar-notifications.component.scss'],
})
export class InternalNavbarNotificationsComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  @Input() userId?: string;
  notifications: NotificationModel[] = [];
  notificationStatusEnum = NotificationStatusEnum;
  isBroker = false;
  private socketSub?: Subscription;

  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  constructor(
    private router: Router,
    private _notifications: NotificationsService,
    private _ui: UiService,
    private _auth: AuthService
  ) {
    this.isBroker = brokerRolesDataset.includes(
      this._auth.getAuth()?.user.role ?? RolesEnum.INSURED
    );
  }

  ngOnInit(): void {
    this.getNotificationsList();

    if (this.userId) {
      this._notifications.initSocket(this.userId);
    }

    this.socketSub = this._notifications.onNotification().subscribe({
      next: (newNotif: NotificationModel) => {
        const receiver =
          (newNotif as any).receiver_id?._id || (newNotif as any).receiver_id;

        if (receiver !== this.userId) return;

        const exists = this.notifications.some(n => n.id === newNotif.id);
        if (!exists) {
          this.notifications.unshift(newNotif);
          this.scrollToTop();
        }
      },
      error: err => console.error('Error en socket de notificaciones:', err),
    });
  }

  ngAfterViewInit(): void {
    this.scrollToTop();
  }

  ngOnDestroy(): void {
    this.socketSub?.unsubscribe();
  }

  getNotificationsList() {
    this._notifications.getNotifications().subscribe({
      next: (resp: NotificationModel[]) => {
        this.notifications = resp;
        this.scrollToTop();
      },
      error: err => {
        console.error('Error cargando notificaciones:', err);
        this._ui.showAlertError('Error cargando notificaciones');
      },
    });
  }

  scrollToTop() {
    if (this.scrollContainer) {
      this.scrollContainer.nativeElement.scrollTop = 0;
    }
  }

  get unreadCount(): number {
    return this.notifications.filter(
      n => n.status === this.notificationStatusEnum.UNREAD
    ).length;
  }

  getDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }

  getTime(dateString: string): string {
    return new Date(dateString).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  redirectTo(notification: NotificationModel) {
    if (!notification.redirectTo) return;

    const base = this.isBroker ? '/portal' : '/portal-client';
    let finalUrl = base + notification.redirectTo;

    let filterParam = null;

    if (finalUrl.includes('/filter')) {
      finalUrl = finalUrl.replace('/filter', '');
      filterParam = '1';
    }

    if (filterParam) {
      finalUrl +=
        (finalUrl.includes('?') ? '&' : '?') + `filter=${filterParam}`;
    }

    this._notifications.markAsRead(notification.id).subscribe({
      next: () => {
        notification.status = this.notificationStatusEnum.READ;
        this.router.navigateByUrl(finalUrl);
      },
      error: () => this._ui.showAlertError('Error'),
    });
  }
}
