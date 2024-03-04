import { Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LatLong } from '@core/models/location';
import { ServiceApi } from '@core/services/service-api.service';
import { NavigationHeaderService } from '@shared/components/navigation/navigation-header/navigation-header.service';
import { Observable, ReplaySubject, Subject, combineLatest, map, merge, take } from 'rxjs';
import { FeedbackFormChildComponent } from './feedback-form-child-component.enum';
import { Category } from './input-feedback-category/input-feedback-category.component';

@Injectable({ providedIn: 'root' })
export class FeedbackFormService {
  private CATEGORY_START_INDEX = 0;
  private CATEGORY_STEPS = ['description', 'group', 'serviceCode'];
  private STEPS = [
    ...this.CATEGORY_STEPS.map(() => FeedbackFormChildComponent.CATEGORY),
    FeedbackFormChildComponent.MESSAGE_AND_ATTACHMENTS,
    FeedbackFormChildComponent.LOCATION,
    FeedbackFormChildComponent.CONTACT,
  ];

  public serviceDictionary = this.serviceApi.getServices();

  public feedbackForm = new FormGroup({
    description: new FormControl<string | null>(null, Validators.required),
    group: new FormControl<string | null>(null, Validators.required),
    serviceCode: new FormControl<string | null>(null, Validators.required),
    message: new FormGroup({
      message: new FormControl<string | null>(null, Validators.required),
      publish: new FormControl<boolean | null>(null),
    }),
    location: new FormControl<LatLong | null>(null, Validators.required),
    contact: new FormGroup({
      email: new FormControl<string | null>(null, Validators.email),
      firstName: new FormControl<string | null>(null),
      lastName: new FormControl<string | null>(null),
      phone: new FormControl<string | null>(null),
      receiveResponseByMail: new FormControl<boolean | null>(null),
      termsOfUseAccepted: new FormControl<boolean>(false, { nonNullable: true, validators: [Validators.requiredTrue] }),
    }),
  });

  public amountOfSteps = Object.keys(FeedbackFormChildComponent).length - 1 + this.CATEGORY_STEPS.length;
  private _currentStepSubject$: Subject<FeedbackFormChildComponent> = new ReplaySubject<FeedbackFormChildComponent>(1);
  public currentStep$ = this._currentStepSubject$.asObservable();
  public currentChildComponent$: Observable<FeedbackFormChildComponent> = this.currentStep$.pipe(map((i) => this.STEPS[i]));

  private _categorySubject$: Subject<Category[]> = new ReplaySubject<Category[]>(1);
  public categories$ = this._categorySubject$.asObservable();

  private _parentCategorySubject$: Subject<string | null> = new ReplaySubject<string | null>(1);
  public parentCategory$ = this._parentCategorySubject$.asObservable();

  public isNextEnabled$: Observable<boolean> = combineLatest([this.currentStep$, this.feedbackForm.valueChanges]).pipe(
    map(([currentStep]) => this.isNextEnabled(currentStep)),
  );

  public categorySteps = this.CATEGORY_STEPS.map((step) => ({
    formControlName: step,
    index: this.getCategoryLevelIndex(step),
  }));

  public constructor(
    private readonly serviceApi: ServiceApi,
    private readonly navigationHeaderService: NavigationHeaderService,
  ) {
    this.setCategoriesByFormValues();
    this.handleFeedbackFormValueChanges();
    this.handleStepChange();

    this._currentStepSubject$.next(0);
  }

  private isNextEnabled(currentStep: number): boolean {
    const component = this.STEPS[currentStep];

    if (component === FeedbackFormChildComponent.CATEGORY) {
      if (currentStep === this.getCategoryLevelIndex('description')) {
        return this.feedbackForm.controls.description.valid;
      }
      if (currentStep === this.getCategoryLevelIndex('group')) {
        return this.feedbackForm.controls.group.valid;
      }
      if (currentStep === this.getCategoryLevelIndex('serviceCode')) {
        return this.feedbackForm.controls.serviceCode.valid;
      }
    }

    if (component === FeedbackFormChildComponent.MESSAGE_AND_ATTACHMENTS) {
      return this.feedbackForm.controls.message.valid;
    }

    if (component === FeedbackFormChildComponent.LOCATION) {
      return true;
    }

    if (component === FeedbackFormChildComponent.CONTACT) {
      return this.feedbackForm.controls.contact.valid;
    }

    return false;
  }

  public back(): void {
    this.currentStep$.pipe(take(1)).subscribe((currentStep) => {
      const newIndex = (currentStep -= 1);

      if (newIndex === this.getCategoryLevelIndex('description')) {
        this.feedbackForm.controls.description.setValue(null);
      }

      if (newIndex === this.getCategoryLevelIndex('group')) {
        this.feedbackForm.controls.group.setValue(null);
      }

      if (newIndex === this.getCategoryLevelIndex('serviceCode')) {
        this.feedbackForm.controls.serviceCode.setValue(null);
      }

      this._currentStepSubject$.next(newIndex);
    });
  }

  public next(): void {
    this.currentStep$.pipe(take(1)).subscribe((currentStep) => {
      this._currentStepSubject$.next((currentStep += 1));
    });
  }

  private handleFeedbackFormValueChanges(): void {
    merge(
      this.feedbackForm.controls.description.valueChanges,
      this.feedbackForm.controls.group.valueChanges,
      this.feedbackForm.controls.serviceCode.valueChanges,
      this.navigationHeaderService.onSkip$,
    )
      .pipe(takeUntilDestroyed())
      .subscribe(() => {
        this.next();
      });

    this.feedbackForm.valueChanges.pipe(takeUntilDestroyed()).subscribe(this.setCategoriesByFormValues.bind(this));
  }

  private handleStepChange(): void {
    this.currentStep$.pipe(takeUntilDestroyed()).subscribe((currentStep) => {
      this.navigationHeaderService.setSkip(currentStep === FeedbackFormChildComponent.LOCATION);
    });
  }

  private setCategoriesByFormValues(): void {
    this.serviceDictionary.pipe(take(1)).subscribe((serviceDictionary) => {
      const description = this.feedbackForm.controls.description.value;
      const group = this.feedbackForm.controls.group.value;

      let categories: Category[] = [];
      let parent: string | null = null;

      if (!description) {
        categories = Object.keys(serviceDictionary).map((key) => ({ value: key }));
      } else if (!group) {
        parent = description;
        categories = Object.keys(serviceDictionary[description]).map((key) => ({ value: key }));
      } else {
        parent = group;
        categories = serviceDictionary[description][group].map(({ name }) => ({ value: name }));
      }

      this._parentCategorySubject$.next(parent);
      this._categorySubject$.next(categories);
    });
  }

  private getCategoryLevelIndex(level: string): number {
    const index = this.CATEGORY_STEPS.findIndex((name) => name === level);

    if (index === -1) {
      return index;
    }

    return index + this.CATEGORY_START_INDEX;
  }
}
