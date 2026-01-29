import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { PopulatedPolicyTypeModel } from 'src/app/shared/interfaces/models/policy-type.model';
import { InsurerConfigService } from '@app/shared/services/insurer-config.service';
import { Router } from '@angular/router';
import { AuthService } from '@app/shared/services/auth.service';
import { RolesEnum } from '@app/shared/enums/roles.enum';

@Component({
  selector: 'app-new-request',
  templateUrl: './new-request.component.html',
  styleUrls: ['./new-request.component.scss'],
})
export class NewRequestComponent {
  selectedType?: PopulatedPolicyTypeModel;
  selectedEndorsements?: PopulatedPolicyTypeModel[];

  constructor(
    private _location: Location,
    private _insurers: InsurerConfigService,
    private router: Router,
    private _auth: AuthService
  ) {
    const role = this._auth.getAuth()?.user?.role;

    this._insurers.getInsurersWithConfig().subscribe(resp => {
      if (resp.length === 0) {
        if (
          role === RolesEnum.AGENCY_OWNER ||
          role === RolesEnum.AGENCY_ADMINISTRATOR ||
          role === RolesEnum.INDEPENDANT_BROKER
        ) {
          this.router.navigateByUrl(`portal/insurer?not_insurers=true`);
        } else {
          this.router.navigateByUrl(`portal/dashboard?not_insurers=true`);
        }
      }
    });
  }

  goBack(): void {
    if (this.selectedType && this.selectedEndorsements?.length) {
      this.selectedEndorsements = undefined;
      return;
    }
    if (this.selectedType) {
      this.selectedType = undefined;
      this.selectedEndorsements = undefined;
      return;
    }
    this._location.back();
  }
}
