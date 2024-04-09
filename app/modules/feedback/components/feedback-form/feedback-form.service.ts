import { Injectable, computed, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { LatLong } from '@core/models/location';
import { ServiceApi } from '@core/services/service-api.service';
import { BehaviorSubject, Observable, ReplaySubject, combineLatest, finalize, map, merge, scan, take } from 'rxjs';
import { FeedbackFormChildComponent } from './feedback-form-child-component.enum';
import { environment } from '@environments/environment';
import { Router } from '@angular/router';
import { ServiceDictionary } from '@core/models/service-api';
import { phoneNumberValidator } from '@shared/validators/phone-number.validator';

type FeedbackFormType = FormGroup<
  {
    message: FormGroup<{
      message: FormControl<string | null>;
      files: FormArray<FormControl<File>>;
    }>;
    location: FormControl<LatLong | null>;
    contact: FormGroup<{
      email: FormControl<string | null>;
      firstName: FormControl<string | null>;
      lastName: FormControl<string | null>;
      phone: FormControl<string | null>;
      termsOfUseAccepted: FormControl<boolean>;
    }>;
  } & {
    [key in (typeof environment.feedbackCategoryLevels)[number]]: FormControl<string | null>;
  }
>;

@Injectable({ providedIn: 'root' })
export class FeedbackFormService {
  private readonly FEEDBACK_CATEGORY_LEVELS = environment.feedbackCategoryLevels;
  private readonly CATEGORY_START_INDEX = 0;
  private readonly STEPS = [
    ...this.FEEDBACK_CATEGORY_LEVELS.map(() => FeedbackFormChildComponent.CATEGORY),
    FeedbackFormChildComponent.MESSAGE_AND_ATTACHMENTS,
    FeedbackFormChildComponent.LOCATION,
    FeedbackFormChildComponent.CONTACT,
  ];

  public feedbackForm: FeedbackFormType = new FormGroup({
    message: new FormGroup({
      message: new FormControl<string | null>(null, Validators.required),
      files: new FormArray<FormControl<File>>([]),
    }),
    location: new FormControl<LatLong | null>(null, Validators.required),
    contact: new FormGroup({
      email: new FormControl<string | null>(null, Validators.email),
      firstName: new FormControl<string | null>(null),
      lastName: new FormControl<string | null>(null),
      phone: new FormControl<string | null>(null, phoneNumberValidator),
      termsOfUseAccepted: new FormControl<boolean>(false, { nonNullable: true, validators: [Validators.requiredTrue] }),
    }),
    ...(Object.fromEntries(
      this.FEEDBACK_CATEGORY_LEVELS.map((step) => [step, new FormControl<string | null>(null, Validators.required)]),
    ) as {
      [key in (typeof this.FEEDBACK_CATEGORY_LEVELS)[number]]: FormControl<string | null>;
    }),
  });

  private categoryFormValues$: Observable<{ [key: string]: any }> = merge(
    ...environment.feedbackCategoryLevels.map((level) =>
      this.feedbackForm.controls[level].valueChanges.pipe(map((value) => ({ [level]: value }))),
    ),
  ).pipe(scan((acc, curr) => ({ ...acc, ...curr }), {}));
  private categoryFormValues = toSignal(this.categoryFormValues$);

  private serviceDictionary = signal<ServiceDictionary>({});
  public categories = computed(() => {
    const serviceDictionary = this.serviceDictionary();

    const mainCategory = this.categoryFormValues()?.[this.FEEDBACK_CATEGORY_LEVELS[0]];
    const subCategory = this.categoryFormValues()?.[this.FEEDBACK_CATEGORY_LEVELS[1]];

    if (!mainCategory) {
      return Object.keys(serviceDictionary).map((key) => ({ value: key }));
    } else if (!subCategory) {
      return Object.keys(serviceDictionary[mainCategory]).map((key) => ({ value: key }));
    } else {
      return serviceDictionary[mainCategory][subCategory].map(({ name, code }) => ({
        label: name,
        value: code,
      }));
    }
  });

  public amountOfSteps = this.STEPS.length;
  private _currentStepSubject$ = new ReplaySubject<FeedbackFormChildComponent>(1);
  public currentStep$ = this._currentStepSubject$.asObservable();
  public currentChildComponent$ = this.currentStep$.pipe(map((i) => this.STEPS[i]));

  public parentCategory = computed(() => {
    const mainCategory = this.categoryFormValues()?.[this.FEEDBACK_CATEGORY_LEVELS[0]];
    const subCategory = this.categoryFormValues()?.[this.FEEDBACK_CATEGORY_LEVELS[1]];
    return subCategory ?? mainCategory;
  });

  private _isNextInProgressSubject$ = new BehaviorSubject<boolean>(false);
  public isNextInProgress$ = this._isNextInProgressSubject$.asObservable();

  public isNextEnabled$: Observable<boolean> = combineLatest([this.currentStep$, this.feedbackForm.valueChanges]).pipe(
    map(([currentStep]) => this.isNextEnabled(currentStep)),
  );

  public categorySteps = this.FEEDBACK_CATEGORY_LEVELS.map((step) => ({
    formControlName: step,
    index: this.getIndexForCategoryStep(step),
  }));

  public constructor(
    private readonly serviceApi: ServiceApi,
    private readonly router: Router,
  ) {
    this.serviceApi
      .getServices()
      .pipe(takeUntilDestroyed())
      .subscribe((value) => this.serviceDictionary.set(value));

    this.handleFeedbackFormValueChanges();
    this._currentStepSubject$.next(0);
  }

  private isNextEnabled(currentStep: number): boolean {
    const component = this.STEPS[currentStep];

    if (component === FeedbackFormChildComponent.MESSAGE_AND_ATTACHMENTS) {
      return this.feedbackForm.controls.message.valid;
    }

    if (component === FeedbackFormChildComponent.LOCATION) {
      return this.feedbackForm.controls.location.valid;
    }

    if (component === FeedbackFormChildComponent.CONTACT) {
      return this.feedbackForm.controls.contact.valid;
    }

    return false;
  }

  public back(): void {
    this.currentStep$.pipe(take(1)).subscribe((currentStep) => {
      const newIndex = currentStep - 1;

      this.FEEDBACK_CATEGORY_LEVELS.forEach((step) => {
        if (newIndex === this.getIndexForCategoryStep(step)) {
          this.feedbackForm.controls[step].setValue(null);
        }
      });

      this._currentStepSubject$.next(newIndex);
    });
  }

  public next(): void {
    this.currentStep$.pipe(take(1)).subscribe((currentStep) => {
      const nextStep = currentStep + 1;

      if (nextStep === this.amountOfSteps) {
        this.postServiceRequest();
      } else {
        this._currentStepSubject$.next(nextStep);
      }
    });
  }

  private handleFeedbackFormValueChanges(): void {
    this.categoryFormValues$.pipe(takeUntilDestroyed()).subscribe(() => {
      this.next();
    });
  }

  private getIndexForCategoryStep(level: string): number {
    const index = this.FEEDBACK_CATEGORY_LEVELS.findIndex((name) => name === level);

    if (index === -1) {
      return index;
    }

    return index + this.CATEGORY_START_INDEX;
  }

  private postServiceRequest(): void {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { service_code, description, message, location, contact } = this.feedbackForm.controls;

    this._isNextInProgressSubject$.next(true);

    this.serviceApi
      .postServiceRequest({
        serviceCode: service_code.value,
        description: description.value,
        files: message.controls.files.value,
        location: location.value,
        email: contact.controls.email.value,
        firstName: contact.controls.firstName.value,
        lastName: contact.controls.lastName.value,
        phone: contact.controls.phone.value,
      })
      .pipe(finalize(() => this._isNextInProgressSubject$.next(false)))
      .subscribe((email?: string) => {
        this.router.navigateByUrl(email ? `feedback/confirmed?email=${email}` : 'feedback/confirmed');
      });
  }
}
