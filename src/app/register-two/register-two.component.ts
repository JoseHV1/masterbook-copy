import { Component } from '@angular/core';
import { OPTIONS_REGISTER_TWO } from '../shared/datatsets/options-register-two.dateset';
import { OptionsRegisterTwoModel } from '../shared/models/options-register-two.model';

@Component({
  selector: 'app-register-two',
  templateUrl: './register-two.component.html',
  styleUrls: ['./register-two.component.scss'],
})
export class RegisterTwoComponent {
  accountTypes: OptionsRegisterTwoModel[] = OPTIONS_REGISTER_TWO;
  optionSelected: number = 0;
  currentStep: number = 1;

  nextStep(): void {
    this.currentStep = 2;
  }
}
