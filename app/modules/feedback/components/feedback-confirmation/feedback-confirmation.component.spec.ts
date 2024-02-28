import { Shallow } from 'shallow-render';
import { FeedbackConfirmationComponent } from './feedback-confirmation.component';
import { FeedbackModule } from '../../feedback.module';
import { ActivatedRoute, convertToParamMap } from '@angular/router';

describe('FeedbackConfirmationComponent', () => {
  let shallow: Shallow<FeedbackConfirmationComponent>;

  beforeEach(() => {
    shallow = new Shallow(FeedbackConfirmationComponent, FeedbackModule).mock(ActivatedRoute, {
      snapshot: { queryParamMap: convertToParamMap({}) },
    });
  });

  describe('query parameters', () => {
    it('should not show feedback has been sent when no email is present in the url', async () => {
      const { find } = await shallow.render();
      expect(find('small')).toHaveLength(0);
    });

    it('should show feedback has been sent when email is present in the url', async () => {
      const { find } = await shallow
        .mock(ActivatedRoute, { snapshot: { queryParamMap: convertToParamMap({ email: 'email@webapp.com' }) } })
        .render();

      const small = find('small');

      expect(small).toHaveLength(1);
      expect(small.nativeElement.textContent).toContain('email@webapp.com');
    });
  });
});
