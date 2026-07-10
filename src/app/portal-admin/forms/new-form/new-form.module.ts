import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule, Routes } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NewAdminFormComponent } from './new-form.component';
import { PagesLayoutModule } from 'src/app/shared/layouts/pages-layout/pages-layout.module';
import { AdminFormFormModule } from '../components/form-form/form-form.module';

const routes: Routes = [{ path: '', component: NewAdminFormComponent }];

@NgModule({
  declarations: [NewAdminFormComponent],
  imports: [
    CommonModule,
    TranslateModule,
    RouterModule.forChild(routes),
    MatTooltipModule,
    PagesLayoutModule,
    AdminFormFormModule,
  ],
})
export class NewAdminFormModule {}
