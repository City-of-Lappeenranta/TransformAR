import { Directive, OnDestroy, inject } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Directive()
export abstract class BaseComponent implements OnDestroy {
  private readonly onDestroy$ = new Subject<void>();

  public ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  public get onDestroy(): Observable<void> {
    return this.onDestroy$.asObservable();
  }
}
