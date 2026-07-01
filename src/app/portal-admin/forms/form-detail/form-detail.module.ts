import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { AdminFormDetailComponent } from './form-detail.component';
import { PagesLayoutModule } from 'src/app/shared/layouts/pages-layout/pages-layout.module';
import { CustomPipesModule } from 'src/app/shared/pipes/custom-pipes.module';
import { CreateFormModalModule } from 'src/app/portal/forms/components/create-form-modal/create-form-modal.module';

const routes: Routes = [{ path: '', component: AdminFormDetailComponent }];

@NgModule({
  declarations: [AdminFormDetailComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TranslateModule,
    MatTooltipModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatDialogModule,
    PagesLayoutModule,
    CustomPipesModule,
    CreateFormModalModule,
  ],
})
export class AdminFormDetailModule {}
