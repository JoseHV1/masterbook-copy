import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule, Routes } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NewBusinessLineComponent } from './new-business-line.component';
import { PagesLayoutModule } from 'src/app/shared/layouts/pages-layout/pages-layout.module';
import { BusinessLineFormModule } from '../components/business-line-form/business-line-form.module';

const routes: Routes = [{ path: '', component: NewBusinessLineComponent }];

@NgModule({
  declarations: [NewBusinessLineComponent],
  imports: [
    CommonModule,
    TranslateModule,
    RouterModule.forChild(routes),
    MatTooltipModule,
    PagesLayoutModule,
    BusinessLineFormModule,
  ],
})
export class NewBusinessLineModule {}
