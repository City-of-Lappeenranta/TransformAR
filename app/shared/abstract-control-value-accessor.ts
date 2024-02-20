import { Directive } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';

@Directive()
export abstract class ControlValueAccessorHelper<T>
  implements ControlValueAccessor
{
  protected onChange?: (value: T) => void;
  protected onTouched?: () => void;

  public registerOnChange(fn: (_: T) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public writeValue(value: T): void {
    this._value = value;
    if (this.onChange) {
      this.onChange(value);
    }
  }

  private _value: T | undefined;

  public get value(): T | undefined {
    return this._value;
  }
}
