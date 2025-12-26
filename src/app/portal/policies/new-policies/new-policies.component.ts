import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PolicyCategoryEnum } from '@app/shared/enums/policy-category.enum';
import { PopulatedAccount } from '@app/shared/interfaces/models/accounts.model';
import { PopulatedPolicyTypeModel } from '@app/shared/interfaces/models/policy-type.model';
import { IntegrationsService } from '@app/shared/services/integration.service';
import { finalize } from 'rxjs';
import { brokersAdminDataset } from 'src/app/shared/datatsets/roles.datasets';
import { RolesEnum } from 'src/app/shared/enums/roles.enum';
import { CreatePolicyRequest } from 'src/app/shared/interfaces/requests/policies/create-policy.request';
import { AuthService } from 'src/app/shared/services/auth.service';
import { QuotesService } from 'src/app/shared/services/quotes.service';
import { UiService } from 'src/app/shared/services/ui.service';

@Component({
  selector: 'app-new-policies',
  templateUrl: './new-policies.component.html',
  styleUrls: ['./new-policies.component.scss'],
})
export class NewPoliciesComponent implements OnInit {
  selectedAccount?: PopulatedAccount;
  selectedType?: PopulatedPolicyTypeModel;
  connected: boolean = false;
  isAdmin!: boolean;
  preFilledInfo?: Partial<CreatePolicyRequest>;
  selectedEndorsements?: PopulatedPolicyTypeModel[];
  form!: FormGroup;
  quoteId?: string;

  constructor(
    private _location: Location,
    private _activateRoute: ActivatedRoute,
    private _ui: UiService,
    private _quote: QuotesService,
    private _auth: AuthService,
    private _integrations: IntegrationsService
  ) {
    this.isAdmin = brokersAdminDataset.includes(
      this._auth.getAuth()?.user?.role ?? RolesEnum.AGENCY_BROKER
    );
    this.quoteId = this._activateRoute.snapshot.queryParams['quote'];
    if (this.quoteId) {
      this._ui.showLoader();
      this._quote
        .getQuote(this.quoteId)
        .pipe(finalize(() => this._ui.hideLoader()))
        .subscribe(quote => {
          this.preFilledInfo = {
            quote_id: quote._id,
            insurer_id: quote.insurer_id,
            prime_amount: quote.prime_amount,
            coverage: quote.coverage,
            deductible: quote.deductible,
            request_documents: quote.request?.request_documents,
            client_id: quote.request?.client_id,
            agent_id: this.isAdmin
              ? quote.request?.client?.broker_id
              : undefined,
            business_line_id: quote.request?.policy_type?.business_line_id,
            policy_type_id: quote.request?.policy_type_id,
            category: quote.request?.category,
            insure_object: quote.request?.insure_object,
            endorsement_ids: quote.request?.endorsement_ids,
            refered_policy_id: quote.request?.refered_policy_id,
          } as Partial<CreatePolicyRequest>;
          this.selectedAccount = quote.request?.client;
        });
    }
  }

  setPrefilledInfo(): Partial<CreatePolicyRequest> {
    this.preFilledInfo = {
      policy_type_id: this.selectedType?._id,
      client_id: this.selectedAccount?._id,
      endorsement_ids: this.selectedEndorsements?.map(item => item._id) || [],
      category: PolicyCategoryEnum.NEW_BUSINESS,
    };

    return this.preFilledInfo;
  }
  ngOnInit(): void {
    this._integrations.getIntegrationsStatus().subscribe({
      next: google => {
        this.connected = this.isAdmin ? !!google?.connected : false;
      },
      error: err => {
        console.error('status failed', err);
      },
    });
  }

  loginGoogle() {
    if (!this.connected) {
      const returnTo = '/portal/policies/new';
      this._integrations.getGoogleAuthUrl(returnTo).subscribe(({ url }) => {
        window.location.href = url;
      });
    }
  }

  goBack(): void {
    if (this.quoteId) {
      this._location.back();
      return;
    }

    if (this.preFilledInfo) {
      this.preFilledInfo = undefined;
      if (this.selectedEndorsements?.length) {
        this.selectedEndorsements = undefined;
      } else {
        this.selectedType = undefined;
        this.selectedEndorsements = undefined;
      }
      return;
    }

    if (this.selectedEndorsements) {
      this.selectedEndorsements = undefined;
      return;
    }

    if (this.selectedType) {
      this.selectedType = undefined;
      return;
    }

    if (this.selectedAccount) {
      this.selectedAccount = undefined;
      return;
    }

    this._location.back();
  }
}
