import { Component, Input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-steps',
  templateUrl: './steps.component.html',
  styleUrls: ['./steps.component.scss'],
})
export class StepsComponent {
  @Input() public amount: number | undefined;
  @Input() public active: number | undefined;

  public get steps(): number[] {
    return [...Array(this.amount).keys()];
  }
}
