import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { UiService } from 'src/app/shared/services/ui.service';
import { finalize, switchMap, take } from 'rxjs';
import { RequestsService } from 'src/app/shared/services/requests.service';
import { PopulatedRequestModel } from 'src/app/shared/interfaces/models/request.model';

@Component({
  selector: 'app-edit-request',
  templateUrl: './edit-request.component.html',
  styleUrls: ['./edit-request.component.scss'],
})
export class EditRequestComponent {
  request!: PopulatedRequestModel;

  constructor(
    private activateRoute: ActivatedRoute,
    private _ui: UiService,
    private _router: Router,
    private _location: Location,
    private _request: RequestsService
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
          if (request.category === 'NEW_BUSINESS') {
            this.request = request;
          }
          // else {
          //   this.getPolicyData(request);
          // }
        },
        error: () => this._router.navigateByUrl('portal/requests'),
      });
  }

  goBack(): void {
    this._location.back();
  }

  // getPolicyData(request: PopulatedRequestModel) {
  //   this._policy.getPolicy(request.refered_policy_id as string).subscribe({
  //     next: (data: PopulatedPolicyModel) => {
  //       this.request = {
  //         ...data,
  //         category: request.category,
  //         serial: request.serial,
  //         _id: request._id,
  //         insure_object: request.insure_object,
  //         coverage: request.coverage,
  //         request_document: request.request_document_url,
  //         description: request.additional_info || '',
  //       };
  //     },
  //   });
  // }
}
