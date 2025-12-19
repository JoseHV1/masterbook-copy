import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { PopulatedPolicyTypeModel } from 'src/app/shared/interfaces/models/policy-type.model';

@Component({
  selector: 'app-new-request',
  templateUrl: './new-request.component.html',
  styleUrls: ['./new-request.component.scss'],
})
export class NewRequestComponent {
  selectedType?: PopulatedPolicyTypeModel;
  selectedEndorsements?: PopulatedPolicyTypeModel[];

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

  constructor(private _location: Location) {}
}
