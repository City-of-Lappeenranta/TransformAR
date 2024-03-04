import { Component } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ServiceDictionary } from '@core/models/service-api';
import { ServiceApi } from '@core/services/service-api.service';
import { NavigationHeaderService } from '@shared/components/navigation/navigation-header/navigation-header.service';
import { Observable, ReplaySubject, Subject, combineLatest, map, merge } from 'rxjs';
import { LatLong } from '../../../../core/models/location';
import { FeedbackFormStep } from './feedback-form-step.enum';
import { Category } from './input-feedback-category/input-feedback-category.component';

type FeedbackForm = FormGroup<{
  mainCategory: FormControl<string>;
  subCategory: FormControl<string | null>;
  motivation: FormControl<string>;
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
}>;

@Component({
  selector: 'app-feedback-form',
  templateUrl: './feedback-form.component.html',
  styleUrls: ['./feedback-form.component.scss'],
})
export class FeedbackFormComponent {
  public feedbackFormStep = FeedbackFormStep;
  public currentFeedbackFormStep = FeedbackFormStep.MAIN_CATEGORY;

  public motivations = [
    { value: 'Thank you', icon: 'thumbs-up' },
    { value: 'Reproach', icon: 'thumbs-down' },
    { value: 'Question', icon: 'question-mark' },
    { value: 'Action proposal', icon: 'call-to-action' },
  ];

  public feedbackForm: FeedbackForm;

  public mainCategories$: Observable<Category[]> = this.serviceApi
    .getServices()
    .pipe(map(this.mapServiceDictionaryToMainCategories));

  private subCategoriesSubject: Subject<Category[]> = new ReplaySubject();
  public subCategories$ = this.subCategoriesSubject.asObservable();

  public constructor(
    private readonly serviceApi: ServiceApi,
    private readonly navigationHeaderService: NavigationHeaderService,
    private readonly formBuilder: FormBuilder,
  ) {
    this.feedbackForm = this.formBuilder.group({
      mainCategory: this.formBuilder.nonNullable.control<string>('', Validators.required),
      subCategory: this.formBuilder.control<string | null>(null, Validators.required),
      motivation: this.formBuilder.nonNullable.control<string>('', Validators.required),
      message: this.formBuilder.group({
        message: this.formBuilder.control<string | null>(null, Validators.required),
        publish: this.formBuilder.control<boolean | null>(null),
        files: this.formBuilder.array<FormControl<File>>([]),
      }),
      location: this.formBuilder.control<LatLong | null>(null),
      contact: this.formBuilder.group({
        email: this.formBuilder.control<string | null>(null, Validators.email),
        firstName: this.formBuilder.control<string | null>(null),
        lastName: this.formBuilder.control<string | null>(null),
        phone: this.formBuilder.control<string | null>(null),
        receiveResponseByMail: this.formBuilder.control<boolean | null>(null),
        termsOfUseAccepted: this.formBuilder.nonNullable.control<boolean>(false, Validators.requiredTrue),
      }),
    });

    this.handleFeedbackFormValueChanges();
    this.getSubCategoryOnMainCategoryChange();
  }

  public get nextButtonLabel(): string {
    return this.currentFeedbackFormStep === FeedbackFormStep.CONTACT ? 'Send feedback' : 'Next';
  }

  public get activeStep(): number {
    return this.currentFeedbackFormStep === FeedbackFormStep.MAIN_CATEGORY ||
      this.currentFeedbackFormStep === FeedbackFormStep.SUB_CATEGORY
      ? 0
      : this.currentFeedbackFormStep - 1;
  }

  public canClickNextButton(): boolean {
    switch (this.currentFeedbackFormStep) {
      case FeedbackFormStep.MAIN_CATEGORY:
        return this.feedbackForm.controls.mainCategory.valid;
      case FeedbackFormStep.SUB_CATEGORY:
        return this.feedbackForm.controls.subCategory.valid;
      case FeedbackFormStep.MOTIVATION: {
        return this.feedbackForm.controls.motivation.valid;
      }
      case FeedbackFormStep.MESSAGE_AND_ATTACHMENTS: {
        return this.feedbackForm.controls.message.valid;
      }
      case FeedbackFormStep.LOCATION: {
        return true;
      }
      case FeedbackFormStep.CONTACT: {
        return this.feedbackForm.controls.contact.valid;
      }
      default: {
        return false;
      }
    }
  }

  public back(): void {
    this.currentFeedbackFormStep -= 1;
    this.navigationHeaderService.setSkip(this.currentFeedbackFormStep === FeedbackFormStep.LOCATION);
  }

  public next(): void {
    this.currentFeedbackFormStep += 1;
    this.navigationHeaderService.setSkip(this.currentFeedbackFormStep === FeedbackFormStep.LOCATION);
  }

  private handleFeedbackFormValueChanges(): void {
    merge(
      this.feedbackForm.controls.mainCategory.valueChanges,
      this.feedbackForm.controls.subCategory.valueChanges,
      this.feedbackForm.controls.motivation.valueChanges,
      this.navigationHeaderService.onSkip$,
    )
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.next());
  }

  private mapServiceDictionaryToMainCategories(serviceDictionary: ServiceDictionary): Category[] {
    return Object.keys(serviceDictionary).map((key) => ({ value: key }));
  }

  private getSubCategoryOnMainCategoryChange(): void {
    combineLatest([this.serviceApi.getServices(), this.feedbackForm.controls.mainCategory.valueChanges])
      .pipe(takeUntilDestroyed())
      .subscribe(([serviceList, mainCategory]) => {
        const subCategories = mainCategory ? Object.keys(serviceList[mainCategory]).map((key) => ({ value: key })) : [];
        this.subCategoriesSubject.next(subCategories);
      });
  }
}
