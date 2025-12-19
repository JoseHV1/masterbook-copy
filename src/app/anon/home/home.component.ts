import { Component } from '@angular/core';
import { HOME_FEATURES, HomeFeatureModel } from './home-content.data';
import { AuthModalService } from '../../shared/services/auth.modal.service';
import { PlansService } from 'src/app/shared/services/plans.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  // plans: ProductModel[] = [];
  features: HomeFeatureModel[] = HOME_FEATURES;

  constructor(
    private _authModal: AuthModalService // private _plans: PlansService
  ) {
    // this.plans = this._plans.getPlans();
  }

  showSingUp() {
    this._authModal.openSignUp();
  }
}
