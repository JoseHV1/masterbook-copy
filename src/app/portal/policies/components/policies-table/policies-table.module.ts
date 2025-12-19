import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PoliciesTableComponent } from './policies-table.component';
import { MatTableModule } from '@angular/material/table';
import { CustomPipesModule } from 'src/app/shared/pipes/custom-pipes.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FiltersModule } from 'src/app/shared/components/filters/filters.module';
import { SetAgentModalModule } from '../set-agent-modal/set-agent-modal.module';
import { CancellationPolicyModalModule } from '../cacellation-policy-modal/cancellation-policy-modal.module';
import { RenewalReinstalmentModalModule } from '../renewal-reinstalment-modal/renewal-reinstalment-modal.module';
import { AddEndorsementsPolicyModalModule } from '../add-endorsements-modal/add-endorsements-modal.module';

@NgModule({
  declarations: [PoliciesTableComponent],
  imports: [
    CommonModule,
    MatTableModule,
    CustomPipesModule,
    MatTooltipModule,
    MatSlideToggleModule,
    FiltersModule,
    SetAgentModalModule,
    CancellationPolicyModalModule,
    RenewalReinstalmentModalModule,
    AddEndorsementsPolicyModalModule,
  ],
  exports: [PoliciesTableComponent],
})
export class PoliciesTableModule {}
