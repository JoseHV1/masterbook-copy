import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule, Routes } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { EditBusinessLineComponent } from './edit-business-line.component';
import { PagesLayoutModule } from 'src/app/shared/layouts/pages-layout/pages-layout.module';
import { BusinessLineFormModule } from '../components/business-line-form/business-line-form.module';
import { CustomPipesModule } from 'src/app/shared/pipes/custom-pipes.module';

const routes: Routes = [{ path: '', component: EditBusinessLineComponent }];

@NgModule({
  declarations: [EditBusinessLineComponent],
  imports: [
    CommonModule,
    TranslateModule,
    RouterModule.forChild(routes),
    MatTooltipModule,
    PagesLayoutModule,
    BusinessLineFormModule,
    CustomPipesModule,
  ],
})
export class EditBusinessLineModule {}
