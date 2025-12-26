import { Component, OnInit } from '@angular/core';
import { AuthModalService } from '../../shared/services/auth.modal.service';
import { ActivatedRoute } from '@angular/router';
import { finalize, switchMap, take } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ActivateUserRequest } from 'src/app/shared/interfaces/requests/auth/activate-user.request';
import { UiService } from 'src/app/shared/services/ui.service';

@Component({
  selector: 'app-email-verify',
  templateUrl: './email-verify.component.html',
  styleUrls: ['./email-verify.component.scss'],
})
export class EmailVerifyComponent implements OnInit {
  success = false;
  loading = true;

  constructor(
    private _authModal: AuthModalService,
    private _route: ActivatedRoute,
    private _auth: AuthService,
    private _ui: UiService
  ) {}

  ngOnInit(): void {
    this._ui.showLoader();
    this._route.queryParams
      .pipe(
        take(1),
        switchMap(params => {
          const token = params['activate'];
          if (!token) throw new Error();
          return this._auth.activateUser({ token } as ActivateUserRequest);
        }),
        finalize(() => {
          this.loading = false;
          this._ui.hideLoader();
        })
      )
      .subscribe({
        next: () => (this.success = true),
        error: () => (this.success = false),
      });
  }

  showLogin() {
    this._authModal.openLogin();
  }
}
