import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivitiesComponent } from './activities.component';
import { RouterModule, Routes } from '@angular/router';
import { PagesLayoutModule } from 'src/app/shared/layouts/pages-layout/pages-layout.module';
import { BreadcrumbsModule } from 'src/app/shared/layouts/pages-layout/breadcrumbs/breadcrumbs.module';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
// import { LeafletModule } from '@bluehalo/ngx-leaflet';
// import { LeafletMarkerClusterModule } from '@bluehalo/ngx-leaflet-markercluster';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';

import { ChartsModule } from 'src/core/charts/charts.module';
import { SummaryCardsModule } from './components/summary-cards/summary-cards.module';
import { ChartsFiltersModule } from './components/chart-filters/chart-filters.module';
import { ClientsMapComponent } from './components/clients-map/clients-map.component';

const routes: Routes = [
  {
    path: '',
    component: ActivitiesComponent,
  },
];

@NgModule({
  declarations: [ActivitiesComponent, ClientsMapComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ChartsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatInputModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatDividerModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    BreadcrumbsModule,
    MatCardModule,
    PagesLayoutModule,
    SummaryCardsModule,
    ChartsFiltersModule,
    LeafletModule,
    // LeafletMarkerClusterModule,
    RouterModule.forChild(routes),
  ],
  exports: [ActivitiesComponent],
})
export class ActivitiesModule {}
