import React from 'react';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';

import { fakeStore } from '../test-helpers';

import ConnectedAssessmentConfirmation, {
  AssessmentConfirmation,
} from '../../../../client/javascript/pages/AssessmentConfirmation';

const prisonerDetails = {
  firstName: 'foo-name',
  surname: 'foo-surname',
  dob: 'foo-date',
  nomisId: 'foo-nomis-id',
};

describe('<AssessmentConfirmation />', () => {
  context('Standalone AssessmentConfirmation', () => {
    it('accepts and correctly renders a profile', () => {
      const wrapper = mount(<AssessmentConfirmation prisoner={prisonerDetails} />);
      const pageText = wrapper.text();
      expect(pageText).to.contain('foo-name');
      expect(pageText).to.contain('foo-surname');
      expect(pageText).to.contain('foo-date');
      expect(pageText).to.contain('foo-nomis-id');
    });

    it('renders the assessment cell sharing outcome', () => {
      const wrapper = mount(
        <AssessmentConfirmation
          outcome={{
            recommendation: 'foo-recommendation',
            rating: 'low',
            reasons: ['foo-reason'],
          }}
        />,
      );
      const pageText = wrapper.text();
      expect(pageText).to.contain('foo-recommendation');
      expect(pageText).to.contain('we think you can act calmly and appropriately around other prisoners');
      expect(pageText).to.contain('foo-reason');
    });

    it('handles form submission', () => {
      const callback = sinon.spy();
      const wrapper = mount(<AssessmentConfirmation onSubmit={callback} />);

      wrapper.find('form').simulate('submit');

      expect(callback.calledOnce).to.equal(true, 'callback called');
    });
  });

  context('Connected AssessmentConfirmation', () => {
    let store;

    beforeEach(() => {
      store = fakeStore({
        riskAssessmentCompletionStatus: {
          completed: [
            {
              nomisId: 'foo-nomis-id',
              recommendation: 'Single Cell',
              rating: 'High',
              reasons: ['foo-reason'],
            },
          ],
        },
        offender: {
          selected: prisonerDetails,
        },
      });
    });

    it('accepts and correctly renders a profile', () => {
      const wrapper = mount(
        <Provider store={store}>
          <ConnectedAssessmentConfirmation />
        </Provider>,
      );
      const pageText = wrapper.text();
      expect(pageText).to.contain('foo-name');
      expect(pageText).to.contain('foo-surname');
      expect(pageText).to.contain('foo-date');
      expect(pageText).to.contain('foo-nomis-id');
      expect(pageText).to.contain('Single Cell');
      expect(pageText).to.contain('foo-reason');
    });

    it('calls the onSubmit action with the answer and section', () => {
      const wrapper = mount(
        <Provider store={store}>
          <ConnectedAssessmentConfirmation />
        </Provider>,
      );

      wrapper.find('input[type="checkbox"]').simulate('change', { target: { checked: true } });
      wrapper.find('form').simulate('submit');

      expect(
        store.dispatch.calledWithMatch({
          type: '@@router/CALL_HISTORY_METHOD',
          payload: { method: 'replace', args: ['/dashboard'] },
        }),
      ).to.equal(true, 'Changed path to /dashboard');
    });
  });
});
