import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatRadioModule } from '@angular/material/radio';
import { TenantScopeModalComponent } from './tenant-scope-modal.component';
import { CDKModule } from 'src/core/cdk/cdk.module';

@NgModule({
  declarations: [TenantScopeModalComponent],
  imports: [CommonModule, FormsModule, TranslateModule, MatRadioModule, CDKModule],
  exports: [TenantScopeModalComponent],
})
export class TenantScopeModalModule {}
