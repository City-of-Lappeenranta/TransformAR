import { Component, EventEmitter, Output, effect, signal } from '@angular/core';
import { DATA_POINT_TYPE_ICON, DataPointType } from '@core/models/data-point';
import { enumToArray } from '@shared/utils/object-utils';

@Component({
  selector: 'app-dashboard-filter',
  templateUrl: './dashboard-filter.component.html',
  styleUrls: ['./dashboard-filter.component.scss'],
})
export class DashboardFilterComponent {
  @Output() public change = new EventEmitter<DataPointType[]>();
  @Output() public close = new EventEmitter<void>();

  public readonly DATA_POINT_TYPE = DataPointType;
  public readonly amount = enumToArray(DataPointType).length;

  private selectedOptions = signal([] as DataPointType[]);

  public constructor() {
    effect(() => {
      this.change.emit(this.selectedOptions());
    });
  }

  public toggleOption(type: DataPointType): void {
    this.selectedOptions.update((current) => {
      const update = [...current];

      if (!update.includes(type)) {
        update.push(type);
      } else {
        update.splice(update.indexOf(type), 1);
      }

      return update;
    });
  }

  public getIcon(type: DataPointType): string {
    return DATA_POINT_TYPE_ICON[type].split('.svg')[0];
  }

  public isSelectedOption(type: DataPointType): boolean {
    return Boolean(this.selectedOptions().find((value) => value === type));
  }
}
