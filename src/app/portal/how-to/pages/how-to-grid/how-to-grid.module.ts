import { NgModule } from '@angular/core';
import { HowToGridComponent } from './how-to-grid.component';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PagesLayoutModule } from '@app/shared/layouts/pages-layout/pages-layout.module';
import { MatListModule } from '@angular/material/list';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CustomPipesModule } from '@app/shared/pipes/custom-pipes.module';
import { CDKModule } from 'src/core/cdk/cdk.module';
import { FormsModule } from '@angular/forms';

const routes: Routes = [
  {
    path: '',
    component: HowToGridComponent,
  },
];

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [HowToGridComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    PagesLayoutModule,
    MatListModule,
    CustomPipesModule,
    MatTooltipModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    CDKModule,
    FormsModule,
  ],
  exports: [HowToGridComponent],
})
export class HowToGridModule {}
