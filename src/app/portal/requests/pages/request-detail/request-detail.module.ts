import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequestDetailComponent } from './request-detail.component';
import { RouterModule, Routes } from '@angular/router';
import { PagesLayoutModule } from 'src/app/shared/layouts/pages-layout/pages-layout.module';
import { MatExpansionModule } from '@angular/material/expansion';
import { CustomPipesModule } from 'src/app/shared/pipes/custom-pipes.module';
import { CDKModule } from 'src/core/cdk/cdk.module';
import { ReactiveFormsModule } from '@angular/forms';
import { QuoteSelectionButtonModule } from '../../components/quote-selection-button/quote-selection-button.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RejectRequestModalModule } from '../../components/reject-policy-modal/reject-request-modal.module';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';

const routes: Routes = [
  {
    path: '',
    component: RequestDetailComponent,
  },
];

@NgModule({
  declarations: [RequestDetailComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    PagesLayoutModule,
    MatExpansionModule,
    CustomPipesModule,
    CDKModule,
    ReactiveFormsModule,
    QuoteSelectionButtonModule,
    MatTooltipModule,
    RejectRequestModalModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
  ],
  exports: [RequestDetailComponent],
})
export class RequestDetailModule {}
