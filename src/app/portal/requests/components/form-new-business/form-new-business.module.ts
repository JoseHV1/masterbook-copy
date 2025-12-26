import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormNewBusinessComponent } from './form-new-business.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CDKModule } from 'src/core/cdk/cdk.module';
import { FormsModalModule } from 'src/app/portal/forms/components/forms-modal/forms-modal.module';

@NgModule({
  declarations: [FormNewBusinessComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    CDKModule,
    FormsModalModule,
    FormsModule,
  ],
  exports: [FormNewBusinessComponent],
})
export class FormNewBusinessModule {}
