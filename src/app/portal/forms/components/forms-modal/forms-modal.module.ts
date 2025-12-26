import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModalComponent } from './forms-modal.component';
import { MatTableModule } from '@angular/material/table';
import { CustomPipesModule } from 'src/app/shared/pipes/custom-pipes.module';
import { FiltersModule } from 'src/app/shared/components/filters/filters.module';
import { CreateFormModalModule } from '../create-form-modal/create-form-modal.module';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [FormsModalComponent],
  imports: [
    CommonModule,
    MatTableModule,
    CustomPipesModule,
    FiltersModule,
    CreateFormModalModule,
    MatTooltipModule,
  ],
  exports: [FormsModalComponent],
})
export class FormsModalModule {}
