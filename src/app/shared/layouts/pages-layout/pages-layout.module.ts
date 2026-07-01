import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesLayoutComponent } from './pages-layout.component';
import { CardModule } from 'primeng/card';
import { BreadcrumbsModule } from './breadcrumbs/breadcrumbs.module';
import { RouterModule } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FloatingActionsModule } from '../../components/floating-actions/floating-actions.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [PagesLayoutComponent],
  imports: [
    CommonModule,
    TranslateModule,
    CardModule,
    BreadcrumbsModule,
    RouterModule,
    MatTooltipModule,
    FloatingActionsModule,
  ],
  exports: [PagesLayoutComponent],
})
export class PagesLayoutModule {}
