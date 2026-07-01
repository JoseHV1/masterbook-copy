import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { InsurerFormComponent } from './insurer-form.component';
import { CDKModule } from 'src/core/cdk/cdk.module';

@NgModule({
  declarations: [InsurerFormComponent],
  imports: [CommonModule, ReactiveFormsModule, TranslateModule, CDKModule],
  exports: [InsurerFormComponent],
})
export class InsurerFormModule {}
