import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormUsersComponent } from './form-users.component';
import { ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { InputNumberModule } from 'primeng/inputnumber';
import { DirectivesModule } from 'src/app/shared/helpers/directives/directives.module';
import { DropdownModule } from 'primeng/dropdown';
import { CDKModule } from 'src/core/cdk/cdk.module';

@NgModule({
  declarations: [FormUsersComponent],
  imports: [
    CommonModule,
    InputTextModule,
    ButtonModule,
    CalendarModule,
    InputNumberModule,
    ReactiveFormsModule,
    DropdownModule,
    DirectivesModule,
    CDKModule,
  ],
  exports: [FormUsersComponent],
})
export class FormUsersModule {}
