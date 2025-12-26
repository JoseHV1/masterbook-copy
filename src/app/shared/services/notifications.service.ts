import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject, map } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { NotificationModel } from '../interfaces/models/notification.model';
import { ApiResponseModel } from '../interfaces/models/api-response.model';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService implements OnDestroy {
  private socket?: Socket;
  private notificationSubject = new Subject<NotificationModel>();
  private connectedUserId?: string;

  constructor(private _http: HttpClient) {}

  getNotifications(): Observable<NotificationModel[]> {
    return this._http
      .get<ApiResponseModel<NotificationModel[]>>(
        `${environment.apiUrl}notifications`
      )
      .pipe(map(resp => resp.data));
  }

  markAsRead(id: string): Observable<NotificationModel> {
    return this._http
      .patch<ApiResponseModel<NotificationModel>>(
        `${environment.apiUrl}notifications/${id}`,
        {}
      )
      .pipe(map(resp => resp.data));
  }

  public initSocket(userId: string): void {
    if (!userId) {
      return;
    }

    if (
      this.socket &&
      this.socket.connected &&
      this.connectedUserId === userId
    ) {
      return;
    }

    if (this.socket) {
      this.socket.disconnect();
    }

    const socketUrl = environment.apiUrl;
    this.socket = io(socketUrl, {
      transports: ['websocket'],
      query: { userId },
    });

    this.connectedUserId = userId;

    this.socket.on('disconnect', reason => {
      console.warn('⚠️ Desconectado del servidor de sockets:', reason);
    });

    this.socket.on('connect_error', err => {
      console.error('❌ Error de conexión al servidor de notificaciones:', err);
    });

    this.socket.on('newNotification', (data: NotificationModel) => {
      this.notificationSubject.next(data);
    });
  }

  onNotification(): Observable<NotificationModel> {
    return this.notificationSubject.asObservable();
  }

  ngOnDestroy(): void {
    this.socket?.disconnect();
  }
}
