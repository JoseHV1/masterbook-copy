import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { PolicyTypeFormComponent } from './policy-type-form.component';
import { CDKModule } from 'src/core/cdk/cdk.module';

@NgModule({
  declarations: [PolicyTypeFormComponent],
  imports: [CommonModule, ReactiveFormsModule, TranslateModule, CDKModule, MatSlideToggleModule],
  exports: [PolicyTypeFormComponent],
})
export class PolicyTypeFormModule {}
