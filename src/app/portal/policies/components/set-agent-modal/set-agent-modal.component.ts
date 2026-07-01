import { Component, Inject } from '@angular/core';
import { MAT_AUTOCOMPLETE_SCROLL_STRATEGY_FACTORY_PROVIDER } from '@angular/material/autocomplete';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { finalize, take } from 'rxjs';
import { PopulatedPolicyModel } from 'src/app/shared/interfaces/models/policy.model';
import { PoliciesService } from 'src/app/shared/services/policies.service';
import { UiService } from 'src/app/shared/services/ui.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-set-agent-modal',
  templateUrl: './set-agent-modal.component.html',
  styleUrls: ['./set-agent-modal.component.scss'],
  providers: [MAT_AUTOCOMPLETE_SCROLL_STRATEGY_FACTORY_PROVIDER],
})
export class SetAgentModalComponent {
  policy?: PopulatedPolicyModel;
  selectedAgent!: string;

  constructor(
    private _dialog: MatDialogRef<SetAgentModalComponent>,
    @Inject(MAT_DIALOG_DATA)
    private _data: { policy: PopulatedPolicyModel },
    private _policy: PoliciesService,
    private _ui: UiService,
    private _t: TranslateService
  ) {
    this.policy = this._data.policy;
    this.selectedAgent = this._data.policy.agent_id;
  }

  setPolicyAgent(): void {
    this._ui
      .showConfirmationModal({
        text: this._t.instant('PORTAL.POLICIES.CONFIRM_SET_AGENT', { policy_number: this.policy?.policy_number }),
      })
      .pipe(take(1))
      .subscribe((resp: boolean) => {
        if (resp) this._executeSetAgent();
      });
  }

  private _executeSetAgent(): void {
    this._ui.showLoader();
    this._policy
      .setPolicyAgent(this.policy?._id ?? '', this.selectedAgent)
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe(() => {
        this._ui.showAlertSuccess(
          this._t.instant('PORTAL.POLICIES.AGENT_SET_SUCCESS')
        );
        this.close(true);
      });
  }

  close(resp: boolean) {
    this._dialog.close(resp);
  }
}
