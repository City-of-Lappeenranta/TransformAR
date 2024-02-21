import { Component, Injector, Input, OnInit } from '@angular/core';
import { NG_VALUE_ACCESSOR, NgControl } from '@angular/forms';
import { ControlValueAccessorHelper } from '@shared/abstract-control-value-accessor';

@Component({
  selector: 'app-input-feedback-category',
  templateUrl: './input-feedback-category.component.html',
  styleUrls: ['./input-feedback-category.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: InputFeedbackCategoryComponent,
      multi: true,
    },
  ],
})
export class InputFeedbackCategoryComponent
  extends ControlValueAccessorHelper<string>
  implements OnInit {
  @Input({ required: true }) public categories:
    | string[]
    | { value: string; icon: string }[] = [];
  @Input() public withColor = true;

  public categoriesToShow: {
    value: string;
    selected: boolean;
    icon?: string;
  }[] = [];

  public hasIcons = false;

  public constructor(private readonly injector: Injector) {
    super();
  }

  public ngOnInit(): void {
    const ngControl = this.injector.get(NgControl);

    this.categoriesToShow = this.categories.map((category) => {
      if (typeof category === 'string') {
        return {
          value: category,
          selected: category === ngControl.value,
        };
      }

      const value = category.value;
      if (!this.hasIcons) {
        this.hasIcons = !!category?.icon;
      }

      return {
        value,
        selected: value === ngControl.value,
        icon: category.icon,
      };
    });
  }

  public toggleCategory(indexToToggle: number): void {
    this.categoriesToShow = this.categoriesToShow.map((category, index) => {
      if (index === indexToToggle) {
        this.writeValue(category.value);
      }

      return {
        ...category,
        selected: index === indexToToggle,
      };
    });
  }
}
