import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule, Routes } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BusinessLineDetailComponent } from './business-line-detail.component';
import { PagesLayoutModule } from 'src/app/shared/layouts/pages-layout/pages-layout.module';
import { TenantScopeModalModule } from 'src/app/shared/components/modals/tenant-scope-modal/tenant-scope-modal.module';
import { CustomPipesModule } from 'src/app/shared/pipes/custom-pipes.module';

const routes: Routes = [{ path: '', component: BusinessLineDetailComponent }];

@NgModule({
  declarations: [BusinessLineDetailComponent],
  imports: [
    CommonModule,
    TranslateModule,
    RouterModule.forChild(routes),
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    PagesLayoutModule,
    TenantScopeModalModule,
    CustomPipesModule,
  ],
})
export class BusinessLineDetailModule {}
