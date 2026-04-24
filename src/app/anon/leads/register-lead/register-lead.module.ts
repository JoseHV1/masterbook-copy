import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { RegisterLeadComponent } from './register-lead.component';
import { FormLeadModule } from './components/form-lead/form-lead.module';

const routes: Routes = [
  {
    path: ':token/:social',
    component: RegisterLeadComponent,
  },
];

@NgModule({
  declarations: [RegisterLeadComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormLeadModule,
  ],
})
export class RegisterLeadModule {}
