// skip-icon.service.ts
import { Injectable } from '@angular/core';
import { ReplaySubject, Subject, take } from 'rxjs';
import { NavigationHeaderAction } from './navigation-header-action.interface';

@Injectable({
  providedIn: 'root',
})
export class NavigationHeaderService {
  private actionSubject = new ReplaySubject<NavigationHeaderAction | null>();
  public action$ = this.actionSubject.asObservable();

  private actionClickSubject = new Subject<string>();
  public onActionClick$ = this.actionClickSubject.asObservable();

  public setAction(value: NavigationHeaderAction | null): void {
    this.actionSubject.next(value);
  }

  public actionClick(): void {
    this.action$.pipe(take(1)).subscribe((action) => {
      action && this.actionClickSubject.next(action.value);
    });
  }
}
