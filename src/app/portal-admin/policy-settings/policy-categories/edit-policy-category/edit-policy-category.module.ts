import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule, Routes } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { EditPolicyCategoryComponent } from './edit-policy-category.component';
import { PagesLayoutModule } from 'src/app/shared/layouts/pages-layout/pages-layout.module';
import { PolicyCategoryFormModule } from '../components/policy-category-form/policy-category-form.module';

const routes: Routes = [{ path: '', component: EditPolicyCategoryComponent }];

@NgModule({
  declarations: [EditPolicyCategoryComponent],
  imports: [
    CommonModule,
    TranslateModule,
    RouterModule.forChild(routes),
    MatTooltipModule,
    PagesLayoutModule,
    PolicyCategoryFormModule,
  ],
})
export class EditPolicyCategoryModule {}
