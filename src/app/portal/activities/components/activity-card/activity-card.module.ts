import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';

import { ActivityCardComponent } from './activity-card.component';

@NgModule({
  declarations: [ActivityCardComponent],
  imports: [CommonModule, MatCardModule, MatDividerModule, MatIconModule],

  exports: [ActivityCardComponent],
})
export class ActivityCardModule {}
