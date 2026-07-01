import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CDKModule } from 'src/core/cdk/cdk.module';
import { AddEndorsementsModalComponent } from './add-endorsements-modal.component';
import { EndorsementsSelectorModule } from '@app/portal/requests/components/endorsements-selector/endorsements-selector.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [AddEndorsementsModalComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CDKModule,
    EndorsementsSelectorModule,
    TranslateModule,
  ],
  exports: [AddEndorsementsModalComponent],
})
export class AddEndorsementsPolicyModalModule {}
