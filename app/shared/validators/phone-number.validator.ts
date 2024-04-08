import { AbstractControl } from '@angular/forms';
import { environment } from '@environments/environment';
import { PhoneNumberUtil } from 'google-libphonenumber';
/**
 * Custom validator function to validate phone numbers using Google's libphonenumber library.
 * @param control The form control containing the phone number to validate.
 * @returns A validation error object if the phone number is invalid, otherwise null.
 */
export function phoneNumberValidator(control: AbstractControl): { [key: string]: any } | null {
  const phoneNumberUtil = PhoneNumberUtil.getInstance();
  const value = control.value;

  if (!value) {
    return null;
  }

  try {
    const phoneNumber = phoneNumberUtil.parseAndKeepRawInput(value, environment.countryCode);
    const isValidNumber = phoneNumberUtil.isValidNumber(phoneNumber);

    if (!isValidNumber) {
      return { invalidPhoneNumber: true };
    }

    return null;
  } catch {
    return { invalidPhoneNumber: true };
  }
}
