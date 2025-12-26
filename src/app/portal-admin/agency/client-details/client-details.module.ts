import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientDetailsComponent } from './client-details.component';
import { RouterModule, Routes } from '@angular/router';
import { PagesLayoutModule } from 'src/app/shared/layouts/pages-layout/pages-layout.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { PictureSelectorModule } from 'src/app/shared/components/picture-selector/picture-selector.module';
import { CustomPipesModule } from 'src/app/shared/pipes/custom-pipes.module';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

const routes: Routes = [
  {
    path: '',
    component: ClientDetailsComponent,
  },
];

@NgModule({
  declarations: [ClientDetailsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    PagesLayoutModule,
    MatTooltipModule,
    MatSlideToggleModule,
    PictureSelectorModule,
    CustomPipesModule,
    MatExpansionModule,
    MatIconModule,
    MatButtonModule,
  ],
  exports: [ClientDetailsComponent],
})
export class ClienDetailsModule {}
