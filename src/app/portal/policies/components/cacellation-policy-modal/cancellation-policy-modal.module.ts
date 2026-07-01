import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CDKModule } from 'src/core/cdk/cdk.module';
import { CancellationModalComponent } from './cancellation-policy-modal.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [CancellationModalComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, CDKModule, TranslateModule],
  exports: [CancellationModalComponent],
})
export class CancellationPolicyModalModule {}
