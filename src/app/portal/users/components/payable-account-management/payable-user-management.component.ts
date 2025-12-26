import { Component } from '@angular/core';

@Component({
  selector: 'app-payable-user-management',
  templateUrl: './payable-user-management.component.html',
  styleUrls: ['./payable-user-management.component.scss'],
})
export class PayableUserManagementComponent {
  maxMasterUser: number = 1;
  maxRegularUser: number = 0;

  currentMasterUser: number = 1;
  currentRegularUser: number = 0;

  increaseMaxMasterUser() {
    this.maxMasterUser++;
  }

  decreaseMaxMasterUser() {
    if (this.maxMasterUser > 0) {
      this.maxMasterUser--;
      if (this.currentMasterUser > this.maxMasterUser) {
        this.currentMasterUser = this.maxMasterUser;
      }
    }
  }

  increaseMaxRegularUser() {
    this.maxRegularUser++;
  }

  decreaseMaxRegularUser() {
    if (this.maxRegularUser > 0) {
      this.maxRegularUser--;
      if (this.currentRegularUser > this.maxRegularUser) {
        this.currentRegularUser = this.maxRegularUser;
      }
    }
  }
}
