import React from 'react';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import xhr from 'xhr';

import { fakeStore } from '../test-helpers';
import { extractDateFromString } from '../../../../client/javascript/utils';

import ConnectedDashboard, {
  Dashboard,
} from '../../../../client/javascript/pages/Dashboard';

const assessments = [
  {
    id: 1,
    nomisId: 'foo-id',
    surname: 'foo-surname',
    forename: 'foo-first-name',
    dateOfBirth: '1-12-2010',
    riskAssessmentCompleted: true,
    healthAssessmentCompleted: true,
    outcome: 'Foo outcome',
  },
  {
    id: 2,
    nomisId: 'bar-id',
    surname: 'foo-surname',
    forename: 'foo-first-name',
    dateOfBirth: '12-2-2010',
    riskAssessmentCompleted: false,
    healthAssessmentCompleted: false,
    outcome: undefined,
  },
];

const state = {
  offender: {
    assessments,
  },
};

const assertGivenValuesInWhiteListAreInPage = (list, whiteList, component) => {
  list.forEach((item) => {
    const keys = Object.keys(item);
    const componentText = component.text();
    keys.forEach((key) => {
      if (whiteList.includes(key)) {
        if (key === 'dateOfBirth') {
          expect(componentText).to.include(extractDateFromString(item[key]));
          return;
        }
        expect(componentText).to.include(item[key]);
      }
    });
  });
};

describe('<Dashboard />', () => {
  context('Standalone Dashboard', () => {
    context('when there is no one assess', () => {
      it('does not display a list of people to assess', () => {
        const wrapper = mount(<Dashboard />);
        expect(wrapper.text()).to.include('There is no one to assess.');
        expect(wrapper.find('tr[data-element-id]').length).to.equal(0);
      });

      it('provides a link to add a person to assess', () => {
        const wrapper = mount(<Dashboard />);
        expect(wrapper.find('[data-element-id="continue-button"]').length).to.equal(1);
      });
    });

    context('when there are people to assess', () => {
      it('accepts a date', () => {
        const date = 'Fooday FooDay FooMonth FooYear';
        const wrapper = mount(<Dashboard assessments={assessments} date={date} />);

        expect(wrapper.text()).to.include(date);
      });

      it('renders the correct number of assessments rows', () => {
        const wrapper = mount(<Dashboard assessments={assessments} />);
        expect(wrapper.find('tr[data-element-id]').length).to.equal(2);
      });

      it('renders the correct profile information per row', () => {
        const wrapper = mount(<Dashboard assessments={assessments} />);
        const whitelist = ['nomisId', 'surname', 'forename', 'dateOfBirth'];

        assertGivenValuesInWhiteListAreInPage(assessments, whitelist, wrapper);
      });

      it('displays a completed assessments', () => {
        const wrapper = mount(<Dashboard assessments={assessments} />);
        expect(wrapper.find('[data-risk-assessment-complete=true]').length).to.equal(
          1,
        );
        expect(wrapper.find('[data-risk-assessment-complete=true]').text()).to.equal(
          'Complete',
        );
      });

      it('displays a completed health assessments', () => {
        const wrapper = mount(<Dashboard assessments={assessments} />);
        expect(
          wrapper.find('[data-health-assessment-complete=true]').length,
        ).to.equal(1);
        expect(
          wrapper.find('[data-health-assessment-complete=true]').text(),
        ).to.equal('Complete');
      });

      it('displays the cell sharing assessment for a completed prisoner assessment', () => {
        const wrapper = mount(<Dashboard assessments={assessments} />);

        expect(wrapper.find('[data-cell-recommendation]').length).to.equal(1);
        expect(wrapper.find('[data-cell-recommendation]').text()).to.equal(
          'Foo outcome',
        );
      });

      it('does not displays the link to view the full assessment when both assessments not complete', () => {
        const wrapper = mount(<Dashboard assessments={assessments} />);

        expect(wrapper.find('[data-element-id="profile-row-bar-id"] > [data-element-id="view-outcome"] button').length).to.equal(0);
      });

      it('displays the link to view the full assessment when both assessments are complete', () => {
        const wrapper = mount(<Dashboard assessments={assessments} />);

        expect(wrapper.find('[data-element-id="profile-row-foo-id"] > [data-element-id="view-outcome"] button').length).to.equal(1);
      });

      it('responds to the selection of an incomplete risk assessment', () => {
        const callback = sinon.spy();
        const wrapper = mount(
          <Dashboard assessments={assessments} onOffenderSelect={callback} />,
        );

        const profileBtn = wrapper.find('[data-risk-assessment-complete=false] > button');

        profileBtn.simulate('click');

        expect(callback.calledOnce).to.equal(true, 'callback called on click');
        expect(callback.calledWith(assessments[1])).to.equal(
          true,
          'callback called with the correct props',
        );
      });
    });
  });

  context('Connected Dashboard', () => {
    it('calls the getOffenderProfiles on component mount', () => {
      const getStub = sinon.stub(xhr, 'get');
      const store = fakeStore(state);

      getStub.yields(null, { status: 200 }, assessments);

      mount(
        <Provider store={store}>
          <ConnectedDashboard />
        </Provider>,
      );

      expect(
        store.dispatch.calledWithMatch({
          type: 'GET_OFFENDER_ASSESSMENTS',
          payload: assessments,
        }),
      ).to.equal(true, 'did not call GET_OFFENDER_ASSESSMENTS action');

      getStub.restore();
    });

    it('renders the correct number of assessments rows', () => {
      const store = fakeStore(state);

      const wrapper = mount(
        <Provider store={store}>
          <ConnectedDashboard />
        </Provider>,
      );

      expect(wrapper.find('tr[data-element-id]').length).to.equal(2);
    });

    it('renders the correct profile information per row', () => {
      const whitelist = ['nomisId', 'surname', 'forename', 'dateOfBirth'];
      const store = fakeStore(state);
      const wrapper = mount(
        <Provider store={store}>
          <ConnectedDashboard />
        </Provider>,
      );

      assertGivenValuesInWhiteListAreInPage(assessments, whitelist, wrapper);
    });

    it('displays a completed assessments', () => {
      const store = fakeStore(state);
      const wrapper = mount(
        <Provider store={store}>
          <ConnectedDashboard />
        </Provider>,
      );
      expect(wrapper.find('[data-risk-assessment-complete=true]').length).to.equal(
        1,
      );
      expect(wrapper.find('[data-risk-assessment-complete=true]').text()).to.equal(
        'Complete',
      );
    });

    it('displays a completed health assessments', () => {
      const store = fakeStore(state);

      const wrapper = mount(
        <Provider store={store}>
          <ConnectedDashboard />
        </Provider>,
      );
      expect(
        wrapper.find('[data-health-assessment-complete=true]').length,
      ).to.equal(1);
      expect(
        wrapper.find('[data-health-assessment-complete=true]').text(),
      ).to.equal('Complete');
    });

    it('displays the cell sharing assessment for a completed prisoner assessment', () => {
      const store = fakeStore(state);

      const wrapper = mount(
        <Provider store={store}>
          <ConnectedDashboard />
        </Provider>,
      );
      expect(wrapper.find('[data-cell-recommendation]').length).to.equal(1);
      expect(wrapper.find('[data-cell-recommendation]').text()).to.equal(
        'Foo outcome',
      );
    });

    it('allows you the view the full outcome when both assessments are complete', () => {
      const store = fakeStore(state);

      const wrapper = mount(
        <Provider store={store}>
          <ConnectedDashboard />
        </Provider>,
      );

      wrapper.find('[data-element-id="view-outcome-link-foo-id"]').simulate('click');

      expect(
        store.dispatch.calledWithMatch({
          type: 'SELECT_OFFENDER',
          payload: assessments[0],
        }),
      ).to.equal(true, 'did not call SELECT_OFFENDER action');

      expect(
        store.dispatch.calledWithMatch({
          type: '@@router/CALL_HISTORY_METHOD',
          payload: { method: 'push', args: ['/full-assessment-outcome'] },
        }),
      ).to.equal(true, 'did not navigate to /full-assessment-outcome');
    });

    it('responds to the selection of an incomplete risk assessment', () => {
      const store = fakeStore(state);
      const wrapper = mount(
        <Provider store={store}>
          <ConnectedDashboard />
        </Provider>,
      );
      const profileBtn = wrapper.find('[data-risk-assessment-complete=false] > button');

      profileBtn.simulate('click');

      expect(
        store.dispatch.calledWithMatch({
          type: 'SELECT_OFFENDER',
          payload: assessments[1],
        }),
      ).to.equal(true, 'SELECT_OFFENDER dispatch');

      expect(
        store.dispatch.calledWithMatch({
          type: '@@router/CALL_HISTORY_METHOD',
          payload: { method: 'push', args: ['/offender-profile'] },
        }),
      ).to.equal(true, 'dispatch /offender-profile');
    });

    it('responds to the selection of an incomplete health assessment by navigation to the first question', () => {
      const store = fakeStore(state);
      const wrapper = mount(
        <Provider store={store}>
          <ConnectedDashboard />
        </Provider>,
      );
      const profileBtn = wrapper.find(
        '[data-health-assessment-complete=false] > button',
      );

      profileBtn.simulate('click');

      expect(
        store.dispatch.calledWithMatch({
          type: 'SELECT_OFFENDER',
          payload: assessments[1],
        }),
      ).to.equal(true, 'SELECT_OFFENDER dispatch');

      expect(
        store.dispatch.calledWithMatch({
          type: '@@router/CALL_HISTORY_METHOD',
          payload: { method: 'push', args: ['/healthcare-assessment/outcome'] },
        }),
      ).to.equal(true, 'dispatch /healthcare-assessment/outcome');
    });
  });
});
