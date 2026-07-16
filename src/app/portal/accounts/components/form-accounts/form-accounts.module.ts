import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormAccountsComponent } from './form-accounts.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DirectivesModule } from 'src/app/shared/helpers/directives/directives.module';
import { CDKModule } from 'src/core/cdk/cdk.module';
import { DateInputModule } from 'src/app/shared/components/date-input/date-input.module';

@NgModule({
  declarations: [FormAccountsComponent],
  imports: [
    TranslateModule, CommonModule, ReactiveFormsModule, DirectivesModule, CDKModule, DateInputModule],
  exports: [FormAccountsComponent],
})
export class FormAccountsModule {}
