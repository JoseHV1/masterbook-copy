import { Component, Input } from '@angular/core';
import { OptionsRegisterTwoModel } from '../../models/options-register-two.model';

@Component({
  selector: 'app-card-option-register-two',
  templateUrl: './card-option-register-two.component.html',
  styleUrls: ['./card-option-register-two.component.scss'],
})
export class CardOptionRegisterTwoComponent {
  @Input() data!: OptionsRegisterTwoModel;
  @Input() selected: boolean = false;
}
