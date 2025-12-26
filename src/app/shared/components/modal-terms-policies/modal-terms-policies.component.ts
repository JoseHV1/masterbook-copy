import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-terms-policies',
  templateUrl: './modal-terms-policies.component.html',
  styleUrls: ['./modal-terms-policies.component.scss'],
})
export class ModalTermsPoliciesComponent {
  show: string = '';

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.show = data.show_container;
  }
}
