import { Component, OnInit } from '@angular/core';
import { OPTIONS_REGISTER_TWO } from '../shared/datatsets/options-register-two.dateset';
import { OptionsRegisterTwoModel } from '../shared/models/options-register-two.model';
import { AuthService } from '../shared/services/auth.service';
import { RolesEnum } from '../shared/enums/roles.enum';

@Component({
  selector: 'app-register-two',
  templateUrl: './register-two.component.html',
  styleUrls: ['./register-two.component.scss'],
})
export class RegisterTwoComponent implements OnInit {
  accountTypes: OptionsRegisterTwoModel[] = OPTIONS_REGISTER_TWO;
  optionSelected: number = 0;
  currentStep: number = 1;

  constructor(private _auth: AuthService) {}

  ngOnInit(): void {
    const role = this._auth.getAuth()?.user?.role;
    if (role === RolesEnum.AGENCY_OWNER) {
      this.optionSelected = 1;
      this.currentStep = 2;
    } else if (role === RolesEnum.INDEPENDANT_BROKER) {
      this.optionSelected = 2;
      this.currentStep = 2;
    }
  }

  nextStep(): void {
    this.currentStep = 2;
  }
}
