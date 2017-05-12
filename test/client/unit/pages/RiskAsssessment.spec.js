import React from 'react';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';

import { fakeStore } from '../test-helpers';

import Assessment from '../../../../client/javascript/pages/RiskAssessment';

const questions = [
  {
    section: 'foo-section',
    title: 'foo-title',
    description: 'foo-description',
    template: 'default_with_aside',
    aside: {
      template: 'static',
      title: 'aside-title',
      description: 'aside-description',
    },
  },
  {
    section: 'bar-section',
    title: 'bar-title',
    description: 'bar-description',
    template: 'default_with_aside',
    aside: {
      template: 'static',
      title: 'aside-title',
      description: 'aside-description',
    },
    sharedCellPredicate: {
      type: 'QUESTION',
      value: 'no',
      dependents: ['bar-section'],
    },
  },
];

describe('<Assessment />', () => {
  let store;

  beforeEach(() => {
    store = fakeStore({
      answers: {
        selectedPrisonerId: 'foo-prisoner-id',
        answers: {},
      },
      questions: {
        csra: questions,
      },
      offender: {
        selected: {
          First_Name: 'foo-first-name',
          Surname: 'foo-surname',
          Date_of_Birth: '17-Nov-1999',
          NOMS_Number: 'AA54321XX',
        },
      },
    });
  });

  it('calls actions when component mounts', () => {
    mount(
      <Provider store={store}>
        <Assessment params={{ section: 'foo-section' }} />
      </Provider>,
    );

    expect(
      store.dispatch.calledWithMatch({ type: 'GET_ASSESSMENT_QUESTIONS' }),
    ).to.equal(true, 'dispatch GET_ASSESSMENT_QUESTIONS');
  });

  it('renders offender details', () => {
    const wrapper = mount(
      <Provider store={store}>
        <Assessment params={{ section: 'foo-section' }} />
      </Provider>,
    );

    expect(wrapper.text()).to.contain('foo-surname');
    expect(wrapper.text()).to.contain('foo-first-name');
  });

  it('calls the onSubmit action with the answer and section', () => {
    const wrapper = mount(
      <Provider store={store}>
        <Assessment params={{ section: 'foo-section' }} />
      </Provider>,
    );

    wrapper.find('#radio-yes').simulate('change', { target: { value: 'yes' } });
    wrapper.find('form').simulate('submit');

    expect(
      store.dispatch.calledWithMatch({
        type: 'SAVE_CSRA_ANSWER',
        payload: { 'foo-section': { answer: 'yes' } },
      }),
    ).to.equal(true, 'Dispatched SAVE_CSRA_ANSWER');

    expect(
      store.dispatch.calledWithMatch({
        type: '@@router/CALL_HISTORY_METHOD',
        payload: { method: 'push', args: ['/assessment/bar-section'] },
      }),
    ).to.equal(true, 'Changed path to /assessment/bar-section');
  });

  it('call the saveExit point action if question fails the decision engine', () => {
    const wrapper = mount(
      <Provider store={store}>
        <Assessment params={{ section: 'bar-section' }} />
      </Provider>,
    );

    wrapper.find('#radio-yes').simulate('change', { target: { value: 'yes' } });
    wrapper.find('form').simulate('submit');

    expect(
      store.dispatch.calledWithMatch({
        type: 'SAVE_EXIT_POINT',
        payload: 'bar-section',
      }),
    ).to.equal(true, 'Dispatched SAVE_EXIT_POINT');
  });
});
