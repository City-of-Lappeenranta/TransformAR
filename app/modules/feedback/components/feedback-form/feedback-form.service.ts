import { Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { LatLong } from '@core/models/location';
import { ServiceApi } from '@core/services/service-api.service';
import { NavigationHeaderService } from '@shared/components/navigation/navigation-header/navigation-header.service';
import { Observable, ReplaySubject, Subject, combineLatest, map, merge, take } from 'rxjs';
import { FeedbackFormChildComponent } from './feedback-form-child-component.enum';
import { Category } from './input-feedback-category/input-feedback-category.component';
import { environment } from '@environments/environment';

type FeedbackFormType = FormGroup<
  {
    message: FormGroup<{
      message: FormControl<string | null>;
      publish: FormControl<boolean | null>;
      files: FormArray<FormControl<File>>;
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
  } & {
    [key in (typeof environment.feedbackCategorySteps)[number]]: FormControl<string | null>;
  }
>;

@Injectable({ providedIn: 'root' })
export class FeedbackFormService {
  private CATEGORY_START_INDEX = 0;
  private STEPS = [
    ...environment.feedbackCategorySteps.map(() => FeedbackFormChildComponent.CATEGORY),
    FeedbackFormChildComponent.MESSAGE_AND_ATTACHMENTS,
    FeedbackFormChildComponent.LOCATION,
    FeedbackFormChildComponent.CONTACT,
  ];

  public serviceDictionary$ = this.serviceApi.getServices();

  public feedbackForm: FeedbackFormType = new FormGroup({
    message: new FormGroup({
      message: new FormControl<string | null>(null, Validators.required),
      publish: new FormControl<boolean | null>(null),
      files: new FormArray<FormControl<File>>([]),
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
    ...(Object.fromEntries(
      environment.feedbackCategorySteps.map((step) => [step, new FormControl<string | null>(null, Validators.required)]),
    ) as {
      [key in (typeof environment.feedbackCategorySteps)[number]]: FormControl<string | null>;
    }),
  });

  public amountOfSteps = this.STEPS.length;
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

  public categorySteps = environment.feedbackCategorySteps.map((step) => ({
    formControlName: step,
    index: this.getIndexForCategoryStep(step),
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

      environment.feedbackCategorySteps.forEach((step) => {
        if (newIndex === this.getIndexForCategoryStep(step)) {
          this.feedbackForm.controls[step].setValue(null);
        }
      });

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
      ...environment.feedbackCategorySteps.map((step) => this.feedbackForm.controls[step].valueChanges),
      this.navigationHeaderService.onSkip$,
    )
      .pipe(takeUntilDestroyed())
      .subscribe(() => {
        this.setCategoriesByFormValues();
        this.next();
      });
  }

  private handleStepChange(): void {
    this.currentChildComponent$.pipe(takeUntilDestroyed()).subscribe((currentChildComponent) => {
      this.navigationHeaderService.setSkip(currentChildComponent === FeedbackFormChildComponent.LOCATION);
    });
  }

  private setCategoriesByFormValues(): void {
    this.serviceDictionary$.pipe(take(1)).subscribe((serviceDictionary) => {
      const firstLevel = this.feedbackForm.controls[environment.feedbackCategorySteps[0]].value;
      const secondLevel = this.feedbackForm.controls[environment.feedbackCategorySteps[1]].value;

      let categories: Category[] = [];
      let parent: string | null = null;

      if (!firstLevel) {
        categories = Object.keys(serviceDictionary).map((key) => ({ value: key }));
      } else if (!secondLevel) {
        parent = firstLevel;
        categories = Object.keys(serviceDictionary[firstLevel]).map((key) => ({ value: key }));
      } else {
        parent = secondLevel;
        categories = serviceDictionary[firstLevel][secondLevel].map(({ name }) => ({ value: name }));
      }

      this._parentCategorySubject$.next(parent);
      this._categorySubject$.next(categories);
    });
  }

  private getIndexForCategoryStep(level: string): number {
    const index = environment.feedbackCategorySteps.findIndex((name) => name === level);

    if (index === -1) {
      return index;
    }

    return index + this.CATEGORY_START_INDEX;
  }
}
