import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { RouterModule, Routes } from '@angular/router';
import { PrimaryButtonModule } from 'src/app/shared/components/primary-button/primary-button.module';
import { PlanCardModule } from 'src/app/shared/components/plan-card/plan-card.module';
import { TranslateModule } from '@ngx-translate/core';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
];

@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    PrimaryButtonModule,
    PlanCardModule,
    TranslateModule,
  ],
})
export class HomeModule {}
