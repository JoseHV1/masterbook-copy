import { AbstractControl } from '@angular/forms';

export const hasError = (
  control: AbstractControl | null | undefined,
  errorName: string
): boolean => {
  return (
    !!control &&
    control.hasError(errorName) &&
    (control.dirty || control.touched)
  );
};
