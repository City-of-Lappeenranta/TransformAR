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
    this.value = value;
  }

  private _value: T | undefined;

  private set value(value: T) {
    this._value = value;
    if (this.onChange) {
      this.onChange(value);
    }
  }

  public get value(): T | undefined {
    return this._value;
  }
}
