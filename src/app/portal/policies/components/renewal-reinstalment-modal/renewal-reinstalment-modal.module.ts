import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CDKModule } from 'src/core/cdk/cdk.module';
import { RenewalReinstalmentModelComponent } from './renewal-reinstalment-modal.component';
import { InputComponent } from 'src/core/cdk/input/input.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [RenewalReinstalmentModelComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, CDKModule, TranslateModule],
  exports: [RenewalReinstalmentModelComponent],
})
export class RenewalReinstalmentModalModule {}
