import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { RegistrationWithInvitationComponent } from './registration-with-invitation.component';

const routes: Routes = [
  { path: '', component: RegistrationWithInvitationComponent },
];

@NgModule({
  declarations: [RegistrationWithInvitationComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    RouterModule.forChild(routes),
  ],
})
export class RegistrationWithInvitationModule {}
