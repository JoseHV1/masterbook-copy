import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CDKModule } from 'src/core/cdk/cdk.module';
import { TranslateModule } from '@ngx-translate/core';
import { RejectRequestModalComponent } from './reject-request-modal.component';

@NgModule({
  declarations: [RejectRequestModalComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TranslateModule, CDKModule],
  exports: [RejectRequestModalComponent],
})
export class RejectRequestModalModule {}
