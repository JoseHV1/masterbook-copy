import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserDetailsComponent } from './user-details.component';
import { RouterModule, Routes } from '@angular/router';
import { PagesLayoutModule } from 'src/app/shared/layouts/pages-layout/pages-layout.module';
import { InputSwitchModule } from 'primeng/inputswitch';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { PictureSelectorModule } from 'src/app/shared/components/picture-selector/picture-selector.module';
import { CustomPipesModule } from 'src/app/shared/pipes/custom-pipes.module';
import { MatExpansionModule } from '@angular/material/expansion';
import { RequestsTableModule } from '../../requests/components/requests-table/requests-table.module';
import { AccountsTableModule } from '../../accounts/components/accounts-table/accounts-table.module';
import { PoliciesTableModule } from '../../policies/components/policies-table/policies-table.module';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';

const routes: Routes = [
  {
    path: '',
    component: UserDetailsComponent,
  },
];

@NgModule({
  declarations: [UserDetailsComponent],
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
    MatMenuModule,
    RequestsTableModule,
    AccountsTableModule,
    PoliciesTableModule,
  ],
  exports: [UserDetailsComponent],
})
export class AccountsDetailsModule {}
