import React from 'react';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';

import { fakeStore } from '../test-helpers';

import viperScores from '../../../../client/javascript/fixtures/viper.json';

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
      rating: 'High',
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
        expect(wrapper.find('[data-profile-row]').length).to.equal(0);
      });

      it('provides a link to add a person to assess', () => {
        const wrapper = mount(<Dashboard />);
        expect(wrapper.find('[data-add-prisoner-button]').length).to.equal(1);
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
        expect(wrapper.find('[data-profile-row]').length).to.equal(2);
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

      it('responds to the selection of an incomplete CSRA assessment', () => {
        const callback = sinon.spy();
        const wrapper = mount(
          <Dashboard profiles={profiles} onOffenderSelect={callback} />,
        );

        const profileBtn = wrapper.find('[data-assessment-complete=false] > a');

        profileBtn.simulate('click');

        expect(callback.calledOnce).to.equal(true, 'callback called on click');
        expect(callback.calledWith(profiles[1])).to.equal(
          true,
          'callback called with the correct props',
        );
      });

      it('calls actions when component mounts', () => {
        const getViperScores = sinon.spy();

        mount(<Dashboard getViperScores={getViperScores} />);

        expect(getViperScores.calledOnce).to.equal(
          true,
          'getViperScores called',
        );
      });
    });
  });

  context('Connected Dashboard', () => {
    let wrapper;
    let store;

    beforeEach(() => {
      store = fakeStore({
        riskAssessmentStatus: {
          completed: [
            {
              nomisId: 'foo-id',
              recommendation: 'Foo cell',
              rating: 'High',
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
      });

      wrapper = mount(
        <Provider store={store}>
          <ConnectedDashboard />
        </Provider>,
      );
    });

    it('renders the correct number of profiles rows', () => {
      expect(wrapper.find('[data-profile-row]').length).to.equal(2);
    });

    it('renders the correct profile information per row', () => {
      const whitelist = ['nomisId', 'surname', 'firstName', 'dob'];

      assertGivenValuesInWhiteListAreInPage(profiles, whitelist, wrapper);
    });

    it('displays a completed assessments', () => {
      expect(wrapper.find('[data-assessment-complete=true]').length).to.equal(
        1,
      );
      expect(wrapper.find('[data-assessment-complete=true]').text()).to.equal(
        'Complete',
      );
    });

    it('displays a completed health assessments', () => {
      expect(
        wrapper.find('[data-health-assessment-complete=true]').length,
      ).to.equal(1);
      expect(
        wrapper.find('[data-health-assessment-complete=true]').text(),
      ).to.equal('Complete');
    });

    it('displays the cell sharing assessment for a completed prisoner assessment', () => {
      expect(wrapper.find('[data-cell-recommendation]').length).to.equal(1);
      expect(wrapper.find('[data-cell-recommendation]').text()).to.equal(
        'Foo outcome',
      );
    });

    it('responds to the selection of an incomplete CSRA assessment', () => {
      const profileBtn = wrapper.find('[data-assessment-complete=false] > a');

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

    it('responds to the selection of an incomplete health assessment by displaying the first question', () => {
      const profileBtn = wrapper.find(
        '[data-health-assessment-complete=false] > a',
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

    it('calls actions when component mounts', () => {
      expect(
        store.dispatch.calledWithMatch({
          type: 'GET_VIPER_SCORES',
          payload: viperScores.output,
        }),
      ).to.equals(true, 'dispatch GET_VIPER_SCORES');
    });
  });
});
