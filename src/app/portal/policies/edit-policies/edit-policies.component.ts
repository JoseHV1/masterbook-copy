import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, switchMap, take } from 'rxjs';
import { brokersAdminDataset } from 'src/app/shared/datatsets/roles.datasets';
import { RolesEnum } from 'src/app/shared/enums/roles.enum';
import { mapToFileInfo } from 'src/app/shared/helpers/map-to-file-info';
import { PopulatedPolicyModel } from 'src/app/shared/interfaces/models/policy.model';
import { CreatePolicyRequest } from 'src/app/shared/interfaces/requests/policies/create-policy.request';
import { AuthService } from 'src/app/shared/services/auth.service';
import { PoliciesService } from 'src/app/shared/services/policies.service';
import { UiService } from 'src/app/shared/services/ui.service';
import { UrlService } from 'src/app/shared/services/url.service';

@Component({
  selector: 'app-edit-policies',
  templateUrl: './edit-policies.component.html',
  styleUrls: ['./edit-policies.component.scss'],
})
export class EditPoliciesComponent {
  policy!: Partial<PopulatedPolicyModel>;
  preFilledInfo!: Partial<CreatePolicyRequest>;

  constructor(
    private activateRoute: ActivatedRoute,
    public url: UrlService,
    private _policy: PoliciesService,
    private _ui: UiService,
    private _router: Router,
    private _location: Location,
    private _auth: AuthService
  ) {
    const isAdmin = brokersAdminDataset.includes(
      this._auth.getAuth()?.user?.role ?? RolesEnum.AGENCY_BROKER
    );

    this._ui.showLoader();
    this.activateRoute.params
      .pipe(
        take(1),
        switchMap(params => {
          const id = params['id'];
          if (!id) throw new Error();
          return this._policy.getPolicyBySerial(id);
        }),
        finalize(() => this._ui.hideLoader())
      )
      .subscribe({
        next: policy => {
          this.policy = {
            ...policy,
            agent_id: isAdmin ? policy.agent_id : undefined,
          };
          this.preFilledInfo = {
            ...this.policy,
            document: this.policy.document,
            request_documents: this.policy.request_documents,
          };
        },
        error: () => this._router.navigateByUrl('portal/policies'),
      });
  }

  goBack(): void {
    this._location.back();
  }
}
