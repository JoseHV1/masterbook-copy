import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PoliciesDetailsComponent } from './policies-details.component';
import { RouterModule, Routes } from '@angular/router';
import { PagesLayoutModule } from 'src/app/shared/layouts/pages-layout/pages-layout.module';
import { AccordionModule } from 'primeng/accordion';
import { CustomPipesModule } from 'src/app/shared/pipes/custom-pipes.module';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';

const routes: Routes = [
  {
    path: '',
    component: PoliciesDetailsComponent,
  },
];

@NgModule({
  declarations: [PoliciesDetailsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    PagesLayoutModule,
    AccordionModule,
    CustomPipesModule,
    MatExpansionModule,
    MatTooltipModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
  ],
  exports: [PoliciesDetailsComponent],
})
export class PoliciesDetailsModule {}
