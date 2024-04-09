import { Directive } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { Subject } from 'rxjs';

@Directive()
export abstract class ControlValueAccessorHelper<T> implements ControlValueAccessor {
  protected valueChanges = new Subject<T>();
  protected onTouched?: () => void;

  private _value: T | undefined;

  public registerOnChange(fn: (_: T) => void): void {
    this.valueChanges.subscribe(fn);
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public writeValue(value: T): void {
    this._value = value;
    this.valueChanges.next(value);
  }

  public get value(): T | undefined {
    return this._value;
  }
}
