import { Component } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ServiceDictionary } from '@core/models/service-api';
import { ServiceApi } from '@core/services/service-api.service';
import { NavigationHeaderService } from '@shared/components/navigation/navigation-header/navigation-header.service';
import { Observable, ReplaySubject, Subject, combineLatest, map, merge } from 'rxjs';
import { LatLong } from '../../../../core/models/location';
import { FeedbackFormStep } from './feedback-form-step.enum';
import { Category } from './input-feedback-category/input-feedback-category.component';

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

  public feedbackForm = new FormGroup({
    mainCategory: new FormControl<string | null>(null, Validators.required),
    subCategory: new FormControl<string | null>(null, Validators.required),
    motivation: new FormControl<string | null>(null, Validators.required),
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

  public mainCategories$: Observable<Category[]> = this.serviceApi
    .getServices()
    .pipe(map(this.mapServiceDictionaryToMainCategories));

  private subCategoriesSubject$: Subject<Category[]> = new ReplaySubject();
  public subCategories$ = this.subCategoriesSubject$.asObservable();

  public constructor(
    private readonly serviceApi: ServiceApi,
    private readonly navigationHeaderService: NavigationHeaderService,
  ) {
    this.handleFeedbackFormValueChanges();
    this.getSubCategoryOnMainCategoryChange();

    this.navigationHeaderService.onActionClick$.pipe(takeUntilDestroyed()).subscribe((value) => {
      if (value.toLowerCase() === 'skip') {
        this.next();
      }
    });
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
  }

  public next(): void {
    this.currentFeedbackFormStep += 1;
  }

  private handleFeedbackFormValueChanges(): void {
    merge(
      this.feedbackForm.controls.mainCategory.valueChanges,
      this.feedbackForm.controls.subCategory.valueChanges,
      this.feedbackForm.controls.motivation.valueChanges,
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
        this.subCategoriesSubject$.next(subCategories);
      });
  }
}
