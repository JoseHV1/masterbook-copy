import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatRadioModule } from '@angular/material/radio';
import { DeleteHowToModalComponent } from './delete-how-to-modal.component';
import { CDKModule } from 'src/core/cdk/cdk.module';

@NgModule({
  declarations: [DeleteHowToModalComponent],
  imports: [CommonModule, FormsModule, TranslateModule, MatRadioModule, CDKModule],
  exports: [DeleteHowToModalComponent],
})
export class DeleteHowToModalModule {}
