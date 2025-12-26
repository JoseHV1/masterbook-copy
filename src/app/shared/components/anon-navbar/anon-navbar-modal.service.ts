import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AnonNavbarModalService {
  private forgotPassword = new Subject<void>();
  private login = new Subject<void>();
  private signUp = new Subject<void>();
  private notification = new Subject<void>();

  public forgotPassword$ = this.forgotPassword.asObservable();
  public login$ = this.login.asObservable();
  public signUp$ = this.signUp.asObservable();
  public notification$ = this.notification.asObservable();

  openForgotPassword(): void {
    this.forgotPassword.next();
  }

  openLogin(): void {
    this.login.next();
  }

  openSignUp(): void {
    this.signUp.next();
  }

  openNotification(): void {
    this.notification.next();
  }
}
