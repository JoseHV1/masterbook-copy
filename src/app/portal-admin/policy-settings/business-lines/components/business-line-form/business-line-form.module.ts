import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { BusinessLineFormComponent } from './business-line-form.component';
import { CDKModule } from 'src/core/cdk/cdk.module';

@NgModule({
  declarations: [BusinessLineFormComponent],
  imports: [CommonModule, ReactiveFormsModule, TranslateModule, CDKModule, MatSlideToggleModule],
  exports: [BusinessLineFormComponent],
})
export class BusinessLineFormModule {}
