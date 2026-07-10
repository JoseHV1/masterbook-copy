import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormNewHowToComponent } from './form-new-how-to.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CDKModule } from 'src/core/cdk/cdk.module';
import { FormsModalModule } from 'src/app/portal/forms/components/forms-modal/forms-modal.module';
import { TranslateModule } from '@ngx-translate/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@NgModule({
  declarations: [FormNewHowToComponent],
  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    RouterModule,
    CDKModule,
    FormsModalModule,
    FormsModule,
    MatSlideToggleModule,
  ],
  exports: [FormNewHowToComponent],
})
export class FormNewHowToModule {}
