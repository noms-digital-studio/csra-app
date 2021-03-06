/* eslint-disable react/jsx-closing-tag-location */

import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter as Router } from 'react-router-dom';
import { mount } from 'enzyme';
import xhr from 'xhr';

import { fakeStore } from '../test-helpers';
import { extractDateFromUTCString } from '../../../../client/javascript/utils';

import ConnectedPrisonerList from '../../../../client/javascript/pages/PrisonerList';

const filteredAssessments = [
  {
    id: 1,
    nomisId: 'foo-id',
    surname: 'Foo-surname',
    forename: 'Foo-forename',
    dateOfBirth: '1970-10-15T00:00:00.000Z',
    riskAssessmentOutcome: true,
    healthAssessmentOutcome: true,
    outcome: 'Foo outcome',
    createdAt: '2017-01-01T00:00:00.000Z',
  },
  {
    id: 2,
    nomisId: 'bar-id',
    surname: 'Bar-surname',
    forename: 'Bar-forename',
    dateOfBirth: '2001-03-04T00:00:00.000Z',
    riskAssessmentOutcome: false,
    healthAssessmentOutcome: true,
    outcome: null,
    createdAt: '2017-01-02T00:00:00.000Z',
  },
  {
    id: 3,
    nomisId: 'baz-id',
    surname: 'Baz-surname',
    forename: 'Baz-forename',
    dateOfBirth: '2001-03-04T00:00:00.000Z',
    riskAssessmentOutcome: true,
    healthAssessmentOutcome: false,
    outcome: null,
    createdAt: '2017-01-02T00:00:00.000Z',
  },
];

const assessments = filteredAssessments.concat([
  {
    id: 4,
    nomisId: 'TEST1-ID',
    surname: 'Test1-surname',
    forename: 'Test1-forename',
    dateOfBirth: '2001-03-04T00:00:00.000Z',
    riskAssessmentOutcome: false,
    healthAssessmentOutcome: false,
    outcome: null,
    createdAt: '2017-01-02T00:00:00.000Z',
  },
  {
    id: 5,
    nomisId: 'TEST2-ID',
    surname: 'Test2-surname',
    forename: 'Test2-forename',
    dateOfBirth: '2001-03-04T00:00:00.000Z',
    riskAssessmentOutcome: true,
    healthAssessmentOutcome: true,
    outcome: 'Test outcome',
    createdAt: '2017-01-02T00:00:00.000Z',
  },
]);

const state = {
  offender: {
    assessments,
  },
  assessmentStatus: {
    awaitingSubmission: {
      risk: [],
      healthcare: [],
    },
  },
};

const assertGivenValuesInWhiteListAreInPage = (list, whiteList, component) => {
  list.forEach((item) => {
    const keys = Object.keys(item);
    const componentText = component.text();
    keys.forEach((key) => {
      if (whiteList.includes(key)) {
        if (key === 'dateOfBirth') {
          expect(componentText).to.include(extractDateFromUTCString(new Date(item[key])));
          return;
        }
        expect(componentText).to.include(item[key]);
      }
    });
  });
};

const mountApp = store =>
  mount(<Provider store={store}>
    <Router>
      <ConnectedPrisonerList />
    </Router>
  </Provider>);

describe('<PrisonerList />', () => {
  describe('Connected PrisonerList', () => {
    let getStub;

    beforeEach(() => {
      getStub = sinon.stub(xhr, 'get');
      getStub.yields(null, { status: 200 }, assessments);
    });

    afterEach(() => {
      getStub.restore();
    });

    it('calls the getOffenderProfiles on component mount', () => {
      const store = fakeStore(state);

      mountApp(store);

      expect(store.dispatch.calledWithMatch({
        type: 'GET_OFFENDER_ASSESSMENTS',
        payload: assessments,
      })).to.equal(true, 'did not call GET_OFFENDER_ASSESSMENTS action');
    });

    it('renders the correct number of assessments rows', () => {
      const store = fakeStore(state);

      const wrapper = mountApp(store);

      expect(wrapper.find('tr[data-element-id]').length).to.equal(3);
    });

    it('renders the correct profile information per row', () => {
      const whitelist = ['nomisId', 'surname', 'forename'];
      const store = fakeStore(state);
      const wrapper = mountApp(store);

      assertGivenValuesInWhiteListAreInPage(
        filteredAssessments,
        whitelist,
        wrapper,
      );
    });

    it('displays a completed assessments', () => {
      const store = fakeStore(state);
      const wrapper = mountApp(store);
      const column = wrapper.find('[data-risk-assessment]');
      expect(column.last().text()).to.equal('Complete');
    });

    it('displays a completed health assessments', () => {
      const store = fakeStore(state);
      const wrapper = mountApp(store);
      const column = wrapper.find('[data-health-assessment]');
      expect(column.first().text()).to.equal('Complete');
    });

    it('displays the cell sharing assessment for a completed prisoner assessment', () => {
      const store = fakeStore(state);
      const wrapper = mountApp(store);
      const row = wrapper.find('[data-assessments-complete=true]');

      expect(row.length).to.equal(1);
      expect(row.text()).to.include('Foo outcome');
    });
  });
});
