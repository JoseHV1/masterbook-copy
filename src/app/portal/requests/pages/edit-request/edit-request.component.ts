import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { UiService } from 'src/app/shared/services/ui.service';
import { finalize, switchMap, take } from 'rxjs';
import { RequestsService } from 'src/app/shared/services/requests.service';
import { PoliciesService } from 'src/app/shared/services/policies.service';
import { PopulatedRequestModel } from 'src/app/shared/interfaces/models/request.model';
import { RequestFromPolicyFormData } from '../../components/form-requests-from-policy/form-requests-from-policy.component';

@Component({
  selector: 'app-edit-request',
  templateUrl: './edit-request.component.html',
  styleUrls: ['./edit-request.component.scss'],
})
export class EditRequestComponent {
  request!: PopulatedRequestModel;
  policyFormData?: RequestFromPolicyFormData;

  constructor(
    private activateRoute: ActivatedRoute,
    private _ui: UiService,
    private _router: Router,
    private _location: Location,
    private _request: RequestsService,
    private _policy: PoliciesService
  ) {
    this._ui.showLoader();
    this.activateRoute.params
      .pipe(
        take(1),
        switchMap(params => {
          const id = params['id'];
          if (!id) throw new Error();
          return this._request.getRequestBySerial(id);
        }),
        finalize(() => this._ui.hideLoader())
      )
      .subscribe({
        next: request => {
          this.request = request;
          if (request.category !== 'NEW_BUSINESS') {
            this.getPolicyData(request);
          }
        },
        error: () => this._router.navigateByUrl('portal/requests'),
      });
  }

  goBack(): void {
    this._location.back();
  }

  getPolicyData(request: PopulatedRequestModel): void {
    if (!request.refered_policy_id) {
      this._router.navigateByUrl('portal/requests');
      return;
    }

    this._ui.showLoader();
    this._policy
      .getPolicy(request.refered_policy_id)
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe({
        next: policy => {
          this.policyFormData = {
            category: request.category,
            policy,
            action: 'edit',
            request,
          };
        },
        error: () => this._router.navigateByUrl('portal/requests'),
      });
  }
}
