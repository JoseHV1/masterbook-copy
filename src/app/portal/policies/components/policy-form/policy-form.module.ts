import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { PolicyFormComponent } from './policy-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CDKModule } from 'src/core/cdk/cdk.module';
import { DirectivesModule } from 'src/app/shared/helpers/directives/directives.module';

@NgModule({
  declarations: [PolicyFormComponent],
  imports: [CommonModule, TranslateModule, ReactiveFormsModule, CDKModule, DirectivesModule],
  exports: [PolicyFormComponent],
})
export class PolicyFormModule {}
