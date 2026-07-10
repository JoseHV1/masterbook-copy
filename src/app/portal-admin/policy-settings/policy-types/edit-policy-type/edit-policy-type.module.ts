import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule, Routes } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { EditPolicyTypeComponent } from './edit-policy-type.component';
import { PagesLayoutModule } from 'src/app/shared/layouts/pages-layout/pages-layout.module';
import { PolicyTypeFormModule } from '../components/policy-type-form/policy-type-form.module';

const routes: Routes = [{ path: '', component: EditPolicyTypeComponent }];

@NgModule({
  declarations: [EditPolicyTypeComponent],
  imports: [
    CommonModule,
    TranslateModule,
    RouterModule.forChild(routes),
    MatTooltipModule,
    PagesLayoutModule,
    PolicyTypeFormModule,
  ],
})
export class EditPolicyTypeModule {}
