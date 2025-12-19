import { AbstractControl } from '@angular/forms';

// export const hasError = (
//   control: AbstractControl,
//   errorName: string
// ): boolean => {
//   return control.hasError(errorName) && (control.dirty || control.touched);
// };

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
