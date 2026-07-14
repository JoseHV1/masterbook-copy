import { NgModule } from '@angular/core';
import { HowToGridComponent } from './how-to-grid.component';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PagesLayoutModule } from '@app/shared/layouts/pages-layout/pages-layout.module';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule } from '@angular/material/paginator';
import { CDKModule } from 'src/core/cdk/cdk.module';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

const routes: Routes = [
  {
    path: '',
    component: HowToGridComponent,
  },
];

@NgModule({
  declarations: [HowToGridComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    PagesLayoutModule,
    MatTooltipModule,
    MatIconModule,
    MatPaginatorModule,
    CDKModule,
    FormsModule,
    TranslateModule,
  ],
  exports: [HowToGridComponent],
})
export class HowToGridModule {}
