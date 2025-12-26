import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClaimsDetailsComponent } from './claims-details.component';
import { RouterModule, Routes } from '@angular/router';
import { PagesLayoutModule } from 'src/app/shared/layouts/pages-layout/pages-layout.module';
import { InputSwitchModule } from 'primeng/inputswitch';
import { FormsModule } from '@angular/forms';
import { CustomPipesModule } from 'src/app/shared/pipes/custom-pipes.module';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

const routes: Routes = [
  {
    path: '',
    component: ClaimsDetailsComponent,
  },
];

@NgModule({
  declarations: [ClaimsDetailsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    PagesLayoutModule,
    InputSwitchModule,
    FormsModule,
    CustomPipesModule,
    MatToolbarModule,
    MatTooltipModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
  ],
  exports: [ClaimsDetailsComponent],
})
export class ClaimsDetailsModule {}
