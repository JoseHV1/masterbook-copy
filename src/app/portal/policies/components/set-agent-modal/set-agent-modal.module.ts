import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CDKModule } from 'src/core/cdk/cdk.module';
import { SetAgentModalComponent } from './set-agent-modal.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [SetAgentModalComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, CDKModule, TranslateModule],
  exports: [SetAgentModalComponent],
})
export class SetAgentModalModule {}
