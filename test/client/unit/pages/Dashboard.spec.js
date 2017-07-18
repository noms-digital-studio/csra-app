import React from 'react';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';

import { fakeStore } from '../test-helpers';

import ConnectedDashboard, {
  Dashboard,
} from '../../../../client/javascript/pages/Dashboard';

const profiles = [
  {
    nomisId: 'foo-id',
    surname: 'foo-surname',
    firstName: 'foo-first-name',
    dob: 'foo-age',
    assessmentCompleted: {
      nomisId: 'foo-id',
      recommendation: 'Foo cell',
      reasons: ['foo-reason'],
    },
    healthAssessmentCompleted: {
      nomisId: 'foo-id',
    },
    outcome: 'Foo outcome',
  },
  {
    nomisId: 'bar-id',
    surname: 'foo-surname',
    firstName: 'foo-first-name',
    dob: 'foo-age',
    assessmentCompleted: {},
    healthAssessmentCompleted: {},
    outcome: undefined,
  },
];

const state = {
  riskAssessmentStatus: {
    completed: [
      {
        nomisId: 'foo-id',
        recommendation: 'Foo cell',
        reasons: ['foo-reason'],
      },
    ],
  },
  healthcareStatus: {
    completed: [
      {
        nomisId: 'foo-id',
      },
    ],
  },
  assessmentOutcomes: {
    'foo-id': 'Foo outcome',
  },
  offender: {
    profiles: [
      {
        nomisId: 'foo-id',
        surname: 'foo-surname',
        firstName: 'foo-first-name',
        dob: 'foo-age',
      },
      {
        nomisId: 'bar-id',
        surname: 'foo-surname',
        firstName: 'foo-first-name',
        dob: 'foo-age',
      },
    ],
  },
};

const assertGivenValuesInWhiteListAreInPage = (list, whiteList, page) => {
  list.forEach((item) => {
    const keys = Object.keys(item);
    keys.forEach((key) => {
      if (whiteList.includes(key)) {
        expect(page.text()).to.include(item[key]);
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
        const wrapper = mount(<Dashboard profiles={profiles} date={date} />);

        expect(wrapper.text()).to.include(date);
      });

      it('renders the correct number of profiles rows', () => {
        const wrapper = mount(<Dashboard profiles={profiles} />);
        expect(wrapper.find('tr[data-element-id]').length).to.equal(2);
      });

      it('renders the correct profile information per row', () => {
        const wrapper = mount(<Dashboard profiles={profiles} />);
        const whitelist = ['nomisId', 'surname', 'firstName', 'dob'];

        assertGivenValuesInWhiteListAreInPage(profiles, whitelist, wrapper);
      });

      it('displays a completed assessments', () => {
        const wrapper = mount(<Dashboard profiles={profiles} />);
        expect(wrapper.find('[data-assessment-complete=true]').length).to.equal(
          1,
        );
        expect(wrapper.find('[data-assessment-complete=true]').text()).to.equal(
          'Complete',
        );
      });

      it('displays a completed health assessments', () => {
        const wrapper = mount(<Dashboard profiles={profiles} />);
        expect(
          wrapper.find('[data-health-assessment-complete=true]').length,
        ).to.equal(1);
        expect(
          wrapper.find('[data-health-assessment-complete=true]').text(),
        ).to.equal('Complete');
      });

      it('displays the cell sharing assessment for a completed prisoner assessment', () => {
        const wrapper = mount(<Dashboard profiles={profiles} />);

        expect(wrapper.find('[data-cell-recommendation]').length).to.equal(1);
        expect(wrapper.find('[data-cell-recommendation]').text()).to.equal(
          'Foo outcome',
        );
      });

      it('does not displays the link to view the full assessment when both assessments not complete', () => {
        const wrapper = mount(<Dashboard profiles={profiles} />);

        expect(wrapper.find('[data-element-id="profile-row-bar-id"] > [data-element-id="view-outcome"] button').length).to.equal(0);
      });

      it('displays the link to view the full assessment when both assessments are complete', () => {
        const wrapper = mount(<Dashboard profiles={profiles} />);

        expect(wrapper.find('[data-element-id="profile-row-foo-id"] > [data-element-id="view-outcome"] button').length).to.equal(1);
      });

      it('responds to the selection of an incomplete risk assessment', () => {
        const callback = sinon.spy();
        const wrapper = mount(
          <Dashboard profiles={profiles} onOffenderSelect={callback} />,
        );

        const profileBtn = wrapper.find('[data-assessment-complete=false] > button');

        profileBtn.simulate('click');

        expect(callback.calledOnce).to.equal(true, 'callback called on click');
        expect(callback.calledWith(profiles[1])).to.equal(
          true,
          'callback called with the correct props',
        );
      });
    });
  });

  context('Connected Dashboard', () => {
    it('renders the correct number of profiles rows', () => {
      const store = fakeStore(state);

      const wrapper = mount(
        <Provider store={store}>
          <ConnectedDashboard />
        </Provider>,
      );

      expect(wrapper.find('tr[data-element-id]').length).to.equal(2);
    });

    it('renders the correct profile information per row', () => {
      const whitelist = ['nomisId', 'surname', 'firstName', 'dob'];
      const store = fakeStore(state);
      const wrapper = mount(
        <Provider store={store}>
          <ConnectedDashboard />
        </Provider>,
      );

      assertGivenValuesInWhiteListAreInPage(profiles, whitelist, wrapper);
    });

    it('displays a completed assessments', () => {
      const store = fakeStore(state);
      const wrapper = mount(
        <Provider store={store}>
          <ConnectedDashboard />
        </Provider>,
      );
      expect(wrapper.find('[data-assessment-complete=true]').length).to.equal(
        1,
      );
      expect(wrapper.find('[data-assessment-complete=true]').text()).to.equal(
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
          payload: profiles[0],
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
      const profileBtn = wrapper.find('[data-assessment-complete=false] > button');

      profileBtn.simulate('click');

      expect(
        store.dispatch.calledWithMatch({
          type: 'SELECT_OFFENDER',
          payload: profiles[1],
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
          payload: profiles[1],
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
