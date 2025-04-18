import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NavigationHeaderService {
  private skipSubject = new BehaviorSubject<boolean>(false);
  public skip$ = this.skipSubject.asObservable();

  private onSkipSubject = new Subject<void>();
  public onSkip$ = this.onSkipSubject.asObservable();

  public setSkip(showSkip: boolean): void {
    this.skipSubject.next(showSkip);
  }

  public onSkipClick(): void {
    this.onSkipSubject.next();
  }
}
