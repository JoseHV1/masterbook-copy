import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountsDetailsComponent } from './accounts-details.component';
import { RouterModule, Routes } from '@angular/router';
import { PagesLayoutModule } from 'src/app/shared/layouts/pages-layout/pages-layout.module';
import { FormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { PictureSelectorModule } from 'src/app/shared/components/picture-selector/picture-selector.module';
import { CustomPipesModule } from 'src/app/shared/pipes/custom-pipes.module';
import { MatExpansionModule } from '@angular/material/expansion';
import { PoliciesTableModule } from '../../policies/components/policies-table/policies-table.module';
import { RequestsTableModule } from '../../requests/components/requests-table/requests-table.module';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

const routes: Routes = [
  {
    path: '',
    component: AccountsDetailsComponent,
  },
];

@NgModule({
  declarations: [AccountsDetailsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    PagesLayoutModule,
    FormsModule,
    MatTooltipModule,
    MatSlideToggleModule,
    PictureSelectorModule,
    CustomPipesModule,
    MatExpansionModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    PoliciesTableModule,
    RequestsTableModule,
  ],
  exports: [AccountsDetailsComponent],
})
export class AccountsDetailsModule {}
