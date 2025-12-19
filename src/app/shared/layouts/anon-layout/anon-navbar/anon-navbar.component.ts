import { Component, OnDestroy } from '@angular/core';
import { AuthModalService } from '../../../services/auth.modal.service';
import { Subject, filter, takeUntil, tap } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { AuthModel } from 'src/app/shared/interfaces/models/auth.model';

@Component({
  selector: 'app-anon-navbar',
  templateUrl: './anon-navbar.component.html',
  styleUrls: ['./anon-navbar.component.scss'],
})
export class AnonNavbarComponent implements OnDestroy {
  private destroy$ = new Subject<void>();
  currenUser: AuthModel | null = null;
  isMobileOpen = false;
  visibleLogin: boolean = false;
  visibleSingUp: boolean = false;
  visibleForgot: boolean = false;
  visibleNotification: boolean = false;
  currentType: string = '';

  constructor(
    private _authModal: AuthModalService,
    private _auth: AuthService,
    private router: Router
  ) {
    this._auth.auth$
      .pipe(takeUntil(this.destroy$))
      .subscribe(auth => (this.currenUser = auth));

    this._authModal.login$
      .pipe(
        takeUntil(this.destroy$),
        tap(() => this.closeModals())
      )
      .subscribe(() => (this.visibleLogin = true));

    this._authModal.forgotPassword$
      .pipe(
        takeUntil(this.destroy$),
        tap(() => this.closeModals())
      )
      .subscribe(() => (this.visibleForgot = true));

    this._authModal.notification$
      .pipe(
        takeUntil(this.destroy$),
        tap(() => this.closeModals())
      )
      .subscribe(() => (this.visibleNotification = true));

    this._authModal.signUp$
      .pipe(
        takeUntil(this.destroy$),
        tap(() => this.closeModals())
      )
      .subscribe(() => (this.visibleSingUp = true));

    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe((event: any) => {
        const url = event['urlAfterRedirects'].split('?')[0] ?? '';
        if (url.includes('clients')) this.currentType = 'clients';
        if (url.includes('agents')) this.currentType = 'agents';
      });
  }

  closeModals() {
    this.visibleForgot = false;
    this.visibleSingUp = false;
    this.visibleLogin = false;
    this.visibleNotification = false;
  }

  logout(): void {
    this._auth
      .logout()
      .subscribe(resp => (resp ? this.router.navigateByUrl('/') : null));
  }

  navigateClient(): void {
    this.router.navigate(['/clients']);
  }

  navigateAgent(): void {
    this.router.navigate(['/agents']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
