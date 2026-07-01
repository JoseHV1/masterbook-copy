import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { RegisterLeadComponent } from './register-lead.component';
import { FormLeadModule } from './components/form-lead/form-lead.module';
import { TranslateModule } from '@ngx-translate/core';

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
    TranslateModule,
  ],
})
export class RegisterLeadModule {}
