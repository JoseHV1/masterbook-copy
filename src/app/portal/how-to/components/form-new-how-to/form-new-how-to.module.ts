import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormNewHowToComponent } from './form-new-how-to.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CDKModule } from 'src/core/cdk/cdk.module';
import { FormsModalModule } from 'src/app/portal/forms/components/forms-modal/forms-modal.module';

@NgModule({
  declarations: [FormNewHowToComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    CDKModule,
    FormsModalModule,
    FormsModule,
  ],
  exports: [FormNewHowToComponent],
})
export class FormNewHowToModule {}
