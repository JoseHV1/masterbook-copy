import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AdminFormFormComponent } from './form-form.component';
import { CDKModule } from 'src/core/cdk/cdk.module';

@NgModule({
  declarations: [AdminFormFormComponent],
  imports: [CommonModule, ReactiveFormsModule, TranslateModule, CDKModule],
  exports: [AdminFormFormComponent],
})
export class AdminFormFormModule {}
