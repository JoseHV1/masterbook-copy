import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule, Routes } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { InsurerDetailComponent } from './insurer-detail.component';
import { PagesLayoutModule } from 'src/app/shared/layouts/pages-layout/pages-layout.module';
import { CustomPipesModule } from 'src/app/shared/pipes/custom-pipes.module';
import { MatDialogModule } from '@angular/material/dialog';
import { TenantScopeModalModule } from 'src/app/shared/components/modals/tenant-scope-modal/tenant-scope-modal.module';

const routes: Routes = [{ path: '', component: InsurerDetailComponent }];

@NgModule({
  declarations: [InsurerDetailComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TranslateModule,
    PagesLayoutModule,
    MatTooltipModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    CustomPipesModule,
    MatDialogModule,
    TenantScopeModalModule,
  ],
})
export class InsurerDetailModule {}
