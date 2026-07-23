import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function CoverageMinValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const primeAmount = control.parent?.get('prime_amount')?.value;

    if (primeAmount == null || control.value == null) return null;

    return control.value < primeAmount ? { coverageLessThanPrime: true } : null;
  };
}
