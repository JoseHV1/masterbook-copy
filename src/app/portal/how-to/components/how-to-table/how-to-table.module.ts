import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HowToTableComponent } from './how-to-table.component';
import { MatTableModule } from '@angular/material/table';
import { CustomPipesModule } from 'src/app/shared/pipes/custom-pipes.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FiltersModule } from 'src/app/shared/components/filters/filters.module';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { DeleteHowToModalModule } from '../delete-how-to-modal/delete-how-to-modal.module';

@NgModule({
  declarations: [HowToTableComponent],
  imports: [
    CommonModule,
    TranslateModule,
    MatTableModule,
    CustomPipesModule,
    MatTooltipModule,
    FiltersModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    DragDropModule,
    DeleteHowToModalModule,
  ],
  exports: [HowToTableComponent],
})
export class HowToTableModule {}
