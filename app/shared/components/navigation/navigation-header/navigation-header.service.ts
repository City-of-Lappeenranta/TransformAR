// skip-icon.service.ts
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { NavigationHeaderAction } from './navigation-header-action.interface';

@Injectable({
  providedIn: 'root',
})
export class NavigationHeaderService {
  private actionSubject = new Subject<NavigationHeaderAction | null>();
  public action$ = this.actionSubject.asObservable();

  private actionClickSubject = new Subject<void>();
  public onActionClick$ = this.actionClickSubject.asObservable();

  public setAction(value: NavigationHeaderAction | null): void {
    this.actionSubject.next(value);
  }

  public actionClick(): void {
    this.actionClickSubject.next();
  }
}
