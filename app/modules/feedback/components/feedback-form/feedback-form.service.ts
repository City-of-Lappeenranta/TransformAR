import { Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, UntypedFormGroup, Validators } from '@angular/forms';
import { LatLong } from '@core/models/location';
import { ServiceApi } from '@core/services/service-api.service';
import { NavigationHeaderService } from '@shared/components/navigation/navigation-header/navigation-header.service';
import { Observable, ReplaySubject, Subject, combineLatest, map, merge, take } from 'rxjs';
import { FeedbackFormChildComponent } from './feedback-form-child-component.enum';
import { Category } from './input-feedback-category/input-feedback-category.component';

type FeedbackFormType = FormGroup<{
  description: FormControl<string | null>;
  group: FormControl<string | null>;
  serviceCode: FormControl<string | null>;
  message: FormGroup<{
    message: FormControl<string | null>;
    publish: FormControl<boolean | null>;
  }>;
  location: FormControl<LatLong | null>;
  contact: FormGroup<{
    email: FormControl<string | null>;
    firstName: FormControl<string | null>;
    lastName: FormControl<string | null>;
    phone: FormControl<string | null>;
    receiveResponseByMail: FormControl<boolean | null>;
    termsOfUseAccepted: FormControl<boolean>;
  }>;
}>;

@Injectable({ providedIn: 'root' })
export class FeedbackFormService {
  private CATEGORY_START_INDEX = 0;
  private CATEGORY_STEPS = ['description', 'group', 'serviceCode'] as const;
  private STEPS = [
    ...this.CATEGORY_STEPS.map(() => FeedbackFormChildComponent.CATEGORY),
    FeedbackFormChildComponent.MESSAGE_AND_ATTACHMENTS,
    FeedbackFormChildComponent.LOCATION,
    FeedbackFormChildComponent.CONTACT,
  ];

  public serviceDictionary = this.serviceApi.getServices();

  public feedbackForm: FeedbackFormType = new UntypedFormGroup({
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
    index: this.getIndexForCategoryStep(step),
  }));

  public constructor(
    private readonly serviceApi: ServiceApi,
    private readonly navigationHeaderService: NavigationHeaderService,
  ) {
    this.addCategoryStepsToForm();
    this.setCategoriesByFormValues();
    this.handleFeedbackFormValueChanges();
    this.handleStepChange();

    this._currentStepSubject$.next(0);
  }

  private isNextEnabled(currentStep: number): boolean {
    const component = this.STEPS[currentStep];

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

      if (newIndex === this.getIndexForCategoryStep(this.CATEGORY_STEPS[0])) {
        this.feedbackForm.controls.description.setValue(null);
      }

      if (newIndex === this.getIndexForCategoryStep(this.CATEGORY_STEPS[1])) {
        this.feedbackForm.controls.group.setValue(null);
      }

      if (newIndex === this.getIndexForCategoryStep(this.CATEGORY_STEPS[2])) {
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

  private addCategoryStepsToForm(): void {
    this.CATEGORY_STEPS.forEach((step) => this.feedbackForm.addControl(step, new FormControl(null, Validators.required)));
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

  private getIndexForCategoryStep(level: string): number {
    const index = this.CATEGORY_STEPS.findIndex((name) => name === level);

    if (index === -1) {
      return index;
    }

    return index + this.CATEGORY_START_INDEX;
  }
}
