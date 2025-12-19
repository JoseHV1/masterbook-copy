import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlanCardComponent } from './plan-card.component';
import { SecondaryButtonModule } from '../secondary-button/secondary-button.module';

@NgModule({
  declarations: [PlanCardComponent],
  imports: [CommonModule, SecondaryButtonModule],
  exports: [PlanCardComponent],
})
export class PlanCardModule {}
