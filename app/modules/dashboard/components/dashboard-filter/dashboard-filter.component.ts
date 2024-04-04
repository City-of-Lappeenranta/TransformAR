import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DATA_POINT_TYPE_ICON, DataPointType } from '@core/models/data-point';
import { enumToArray } from '@shared/utils/object-utils';

@Component({
  selector: 'app-dashboard-filter',
  templateUrl: './dashboard-filter.component.html',
  styleUrls: ['./dashboard-filter.component.scss'],
})
export class DashboardFilterComponent {
  @Input() public filter: DataPointType[] = [];

  @Output() public toggle = new EventEmitter<DataPointType>();
  @Output() public close = new EventEmitter<void>();

  public readonly DATA_POINT_TYPE = DataPointType;
  public readonly amount = enumToArray(DataPointType).length;

  public constructor() {}

  public onClick(type: DataPointType): void {
    this.toggle.emit(type);
  }

  public getIcon(type: DataPointType): string {
    return DATA_POINT_TYPE_ICON[type].split('.svg')[0];
  }

  public isSelectedOption(type: DataPointType): boolean {
    return this.filter.findIndex((value) => value === type) > -1;
  }
}
