import { Component, Injector, Input, OnChanges, SimpleChanges } from '@angular/core';
import {
  FormControl,
  FormControlDirective,
  FormControlName,
  FormGroupDirective,
  NG_VALUE_ACCESSOR,
  NgControl,
} from '@angular/forms';
import { ControlValueAccessorHelper } from '@shared/abstract-control-value-accessor';

export interface Category {
  value: string;
  icon?: string;
}

type CategoryToShow = Category & {
  selected: boolean;
};

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
export class InputFeedbackCategoryComponent extends ControlValueAccessorHelper<string> implements OnChanges {
  @Input({ required: true }) public categories!: Category[];
  @Input() public withColor = true;

  public categoriesToShow: CategoryToShow[] = [];
  public hasIcons = false;

  public constructor(private readonly injector: Injector) {
    super();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['categories']) {
      this.setCategoriesToShow();
    }
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

  private setCategoriesToShow(): void {
    this.categoriesToShow = this.categories.map((category) => {
      const value = category.value;
      if (!this.hasIcons) {
        this.hasIcons = !!category?.icon;
      }

      return {
        value,
        selected: value === this.getFormValue(),
        icon: category.icon,
      };
    });
  }

  private getFormValue(): string {
    const injectedControl = this.injector.get(NgControl);

    if (injectedControl.constructor === FormControlName) {
      return this.injector.get(FormGroupDirective).getControl(injectedControl as FormControlName).value;
    }

    return ((injectedControl as FormControlDirective).form as FormControl)?.value;
  }
}
