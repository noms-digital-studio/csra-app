import React from 'react';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';

import { fakeStore } from '../test-helpers';

import HealthcareSummary from '../../../../client/javascript/pages/HealthcareSummary';

const prisonerDetails = {
  firstName: 'foo-name',
  surname: 'foo-surname',
  dob: 'foo-date',
  nomisId: 'foo-nomis-id',
};

const healthcareAnswers = {
  outcome: {
    answer: 'yes',
  },
  comments: {},
  consent: {
    answer: 'no',
  },
  assessor: {
    role: 'foo role',
    'full-name': 'Foo fullname',
    day: '20',
    month: '12',
    year: '1984',
  },
};

const storeData = {
  answers: {
    selectedPrisonerId: 'foo-nomis-id',
    healthcare: {
      'foo-nomis-id': healthcareAnswers,
    },
  },
  offender: {
    selected: prisonerDetails,
  },
};

describe('<HealthcareSummary />', () => {
  context('Connected HealthcareSummary', () => {
    it('accepts and correctly renders a prisoner`s details', () => {
      const store = fakeStore(storeData);
      const wrapper = mount(
        <Provider store={store}>
          <HealthcareSummary />
        </Provider>,
      );
      const prisonerProfile = wrapper.find('[data-profile]').text();
      expect(prisonerProfile).to.contain('foo-name');
      expect(prisonerProfile).to.contain('foo-surname');
      expect(prisonerProfile).to.contain('foo-date');
      expect(prisonerProfile).to.contain('foo-nomis-id');
    });

    context('Healthcare outcome', () => {
      it('correctly renders a high risk outcome', () => {
        const store = fakeStore(storeData);
        const wrapper = mount(
          <Provider store={store}>
            <HealthcareSummary />
          </Provider>,
        );
        const healthcareOutcome = wrapper.find('[data-healthcare-outcome]').text();
        expect(healthcareOutcome).to.contain('yes - high risk');
      });

      it('correctly renders a low risk outcome', () => {
        const healthcareAnswersLow = { ...healthcareAnswers, outcome: { answer: 'no' } };
        const storeDataLow = {
          ...storeData,
          answers: { ...storeData.answers, healthcare: { 'foo-nomis-id': healthcareAnswersLow } },
        };
        const store = fakeStore(storeDataLow);
        const wrapper = mount(
          <Provider store={store}>
            <HealthcareSummary />
          </Provider>,
        );
        const healthcareOutcome = wrapper.find('[data-healthcare-outcome]').text();
        expect(healthcareOutcome).to.contain('no - low risk');
      });
    });

    context('Healthcare comments', () => {
      it('correctly renders a no comments', () => {
        const store = fakeStore(storeData);
        const wrapper = mount(
          <Provider store={store}>
            <HealthcareSummary />
          </Provider>,
        );
        const healthcareComments = wrapper.find('[data-healthcare-comments]').text();
        expect(healthcareComments).to.contain('none');
      });

      it('correctly renders comments', () => {
        const healthcareAnswersWithComments = { ...healthcareAnswers, comments: { comments: 'some foo comment' } };
        const storeDataLow = {
          ...storeData,
          answers: { ...storeData.answers, healthcare: { 'foo-nomis-id': healthcareAnswersWithComments } },
        };
        const store = fakeStore(storeDataLow);
        const wrapper = mount(
          <Provider store={store}>
            <HealthcareSummary />
          </Provider>,
        );
        const healthcareComments = wrapper.find('[data-healthcare-comments]').text();
        expect(healthcareComments).to.contain('some foo comment');
      });
    });

    it('correctly renders consent', () => {
      const store = fakeStore(storeData);
      const wrapper = mount(
        <Provider store={store}>
          <HealthcareSummary />
        </Provider>,
      );
      const healthcareComments = wrapper.find('[data-healthcare-consent]').text();
      expect(healthcareComments).to.contain('no');
    });

    it('correctly renders assessor details', () => {
      const store = fakeStore(storeData);
      const wrapper = mount(
        <Provider store={store}>
          <HealthcareSummary />
        </Provider>,
      );
      const healthcareAssessor = wrapper.find('[data-healthcare-assessor]').text();
      expect(healthcareAssessor).to.contain('Foo fullname');
      expect(healthcareAssessor).to.contain('foo role');
      expect(healthcareAssessor).to.contain('20-12-1984');
    });
  });
});
