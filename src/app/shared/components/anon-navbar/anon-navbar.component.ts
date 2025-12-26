import { Component, OnDestroy } from '@angular/core';
import { AnonNavbarModalService } from './anon-navbar-modal.service';
import { Subject, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'app-anon-navbar',
  templateUrl: './anon-navbar.component.html',
  styleUrls: ['./anon-navbar.component.scss'],
})
export class AnonNavbarComponent implements OnDestroy {
  private destroy$ = new Subject<void>();
  isMobileOpen = false;
  visibleLogin: boolean = false;
  visibleSingUp: boolean = false;
  visibleForgot: boolean = false;
  visibleNotification: boolean = false;

  constructor(private _anonNavberModal: AnonNavbarModalService) {
    this._anonNavberModal.login$
      .pipe(
        takeUntil(this.destroy$),
        tap(() => this.closeModals())
      )
      .subscribe(() => (this.visibleLogin = true));

    this._anonNavberModal.forgotPassword$
      .pipe(
        takeUntil(this.destroy$),
        tap(() => this.closeModals())
      )
      .subscribe(() => (this.visibleForgot = true));

    this._anonNavberModal.notification$
      .pipe(
        takeUntil(this.destroy$),
        tap(() => this.closeModals())
      )
      .subscribe(() => (this.visibleNotification = true));

    this._anonNavberModal.signUp$
      .pipe(
        takeUntil(this.destroy$),
        tap(() => this.closeModals())
      )
      .subscribe(() => (this.visibleSingUp = true));
  }

  closeModals() {
    this.visibleForgot = false;
    this.visibleSingUp = false;
    this.visibleLogin = false;
    this.visibleNotification = false;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
