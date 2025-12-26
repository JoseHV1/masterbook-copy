import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { RegisterTwoComponent } from './register-two.component';
import { DialogModule } from 'primeng/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { PlanCardModule } from '../shared/components/plan-card/plan-card.module';
import { AnonLayoutModule } from '../shared/layouts/anon-layout/anon-layout.module';
import { CardOptionRegisterTwoModule } from '../shared/components/card-option-register-two/card-option-register-two.module';
import { FormAgencyModule } from './components/form-agency/form-agency.module';
import { FormIndependentAgentModule } from './components/form-independent-agent/form-independent-agent.module';

const routes: Routes = [
  {
    path: '',
    component: RegisterTwoComponent,
  },
];

@NgModule({
  declarations: [RegisterTwoComponent],
  imports: [
    CommonModule,
    DialogModule,
    ReactiveFormsModule,
    TranslateModule,
    PlanCardModule,
    AnonLayoutModule,
    RouterModule.forChild(routes),
    CardOptionRegisterTwoModule,
    FormAgencyModule,
    FormIndependentAgentModule,
  ],
  exports: [RegisterTwoComponent],
})
export class RegisterTwoModule {}
