import {
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors,
} from '@angular/forms';
import { InsurerService } from '../services/insurer.service';
import { catchError, map, Observable, of } from 'rxjs';
import { PolicyCategoryEnum } from '../enums/policy-category.enum';
import { CommissionConfigModel } from '../interfaces/models/commission-config.model';

export function ConfiguredInsurerAsyncValidator(
  _insurer: InsurerService,
  policy_type_id: string,
  category: PolicyCategoryEnum
): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    return _insurer
      .getInsurerCommissionConfig(control.value, policy_type_id)
      .pipe(
        map((resp: CommissionConfigModel[]) =>
          resp.filter(
            i => (i.type as unknown as PolicyCategoryEnum) === category
          )
        ),
        map((resp: CommissionConfigModel[]) => {
          return resp.length === 0 ? { UNCONFIGINSURER: true } : null;
        }),
        catchError(() => of(null))
      );
  };
}
