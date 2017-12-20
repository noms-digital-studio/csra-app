import React from 'react';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import xhr from 'xhr';

import { fakeStore } from '../test-helpers';
import { extractDateFromUTCString } from '../../../../client/javascript/utils';

import ConnectedDashboard, { Dashboard } from '../../../../client/javascript/pages/Dashboard';

const filteredAssessments = [
  {
    id: 1,
    nomisId: 'foo-id',
    surname: 'Foo-surname',
    forename: 'Foo-forename',
    dateOfBirth: '1970-10-15T00:00:00.000Z',
    riskAssessmentCompleted: true,
    healthAssessmentCompleted: true,
    outcome: 'Foo outcome',
    createdAt: '2017-01-01T00:00:00.000Z',
  },
  {
    id: 2,
    nomisId: 'bar-id',
    surname: 'Bar-surname',
    forename: 'Bar-forename',
    dateOfBirth: '2001-03-04T00:00:00.000Z',
    riskAssessmentCompleted: false,
    healthAssessmentCompleted: true,
    outcome: null,
    createdAt: '2017-01-02T00:00:00.000Z',
  },
  {
    id: 3,
    nomisId: 'baz-id',
    surname: 'Baz-surname',
    forename: 'Baz-forename',
    dateOfBirth: '2001-03-04T00:00:00.000Z',
    riskAssessmentCompleted: true,
    healthAssessmentCompleted: false,
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
    riskAssessmentCompleted: false,
    healthAssessmentCompleted: false,
    outcome: null,
    createdAt: '2017-01-02T00:00:00.000Z',
  },
  {
    id: 5,
    nomisId: 'TEST2-ID',
    surname: 'Test2-surname',
    forename: 'Test2-forename',
    dateOfBirth: '2001-03-04T00:00:00.000Z',
    riskAssessmentCompleted: true,
    healthAssessmentCompleted: true,
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

describe('<Dashboard />', () => {
  describe('Standalone Dashboard', () => {
    context('when there is no one assess', () => {
      it('does not display a list of people to assess', () => {
        const wrapper = mount(<Dashboard />);
        expect(wrapper.text()).to.include('There is no one to assess.');
        expect(wrapper.find('table').length).to.equal(0);
      });

      it('provides a link to add a person to assess', () => {
        const wrapper = mount(<Dashboard />);
        expect(wrapper.find('[data-element-id="add-assessment"]').length).to.equal(1);
      });
    });

    context('when there are people to assess', () => {
      it('renders the correct number of assessments rows', () => {
        const wrapper = mount(<Dashboard assessments={assessments} />);
        expect(wrapper.find('tr[data-element-id]').length).to.equal(3);
      });

      it('renders the correct profile information per row', () => {
        const wrapper = mount(<Dashboard assessments={assessments} />);
        const whitelist = ['nomisId', 'surname', 'forename', 'dateOfBirth'];

        assertGivenValuesInWhiteListAreInPage(filteredAssessments, whitelist, wrapper);
      });

      it('displays a completed risk assessments', () => {
        const wrapper = mount(<Dashboard assessments={assessments} />);
        const row = wrapper.find('[data-risk-assessment-complete=true]');
        expect(row.length).to.equal(2);
        expect(row.first().text()).to.equal('Complete');
      });

      it('displays a completed health assessments', () => {
        const wrapper = mount(<Dashboard assessments={assessments} />);
        const column = wrapper.find('[data-health-assessment-complete=true]');
        expect(column.length).to.equal(2);
        expect(column.first().text()).to.equal('Complete');
      });

      it('displays the cell sharing assessment for a completed prisoner assessment', () => {
        const wrapper = mount(<Dashboard assessments={assessments} />);
        const row = wrapper.find('[data-assessments-complete=true]');

        expect(row.length).to.equal(1);
        expect(row.text()).to.include('Foo outcome');
      });

      it('does not displays the link to view the full assessment when both assessments not complete', () => {
        const wrapper = mount(<Dashboard assessments={assessments} />);
        const viewOutcomeBtn = wrapper.find(
          '[data-element-id="profile-row-bar-id"] > [data-element-id="view-outcome"] button',
        );

        expect(viewOutcomeBtn.length).to.equal(0);
      });

      it('displays the link to view the full assessment when both assessments are complete', () => {
        const wrapper = mount(<Dashboard assessments={assessments} />);
        const viewOutcomeBtn = wrapper.find(
          '[data-element-id="profile-row-foo-id"] > [data-element-id="view-outcome"] button',
        );

        expect(viewOutcomeBtn.length).to.equal(1);
      });

      it('responds to the selection of an incomplete risk assessment', () => {
        const callback = sinon.spy();
        const wrapper = mount(<Dashboard assessments={assessments} onOffenderSelect={callback} />);

        const profileBtn = wrapper.find('[data-risk-assessment-complete=false] > button');

        profileBtn.simulate('click');

        expect(callback.calledOnce).to.equal(true, 'callback called on click');

        expect(callback.lastCall.args[0]).to.deep.include(assessments[1]);
      });

      it('does not display any nomis ids that start with the word `TEST-`', () => {
        const wrapper = mount(<Dashboard assessments={assessments} />);
        const table = wrapper.find('table');
        expect(table.text().toUpperCase()).to.not.match(/test.+-/ig);
      });
    });
  });

  describe('Connected Dashboard', () => {
    let getStub;

    beforeEach(() => {
      getStub = sinon.stub(xhr, 'get');
      getStub.yields(null, { status: 200 }, assessments);
    });

    afterEach(() => {
      getStub.restore();
    });

    it('displays test assessments when the `displayTestAssessments` query param is present', () => {
      const store = fakeStore(state);
      const wrapper = mount(
        <Provider store={store}>
          <ConnectedDashboard location={{ query: { displayTestAssessments: 'true' } }} />
        </Provider>,
      );
      expect(wrapper.find('tr[data-element-id]').length).to.equal(5);
    });

    it('calls the getOffenderProfiles on component mount', () => {
      const store = fakeStore(state);
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
    });

    it('renders the correct number of assessments rows', () => {
      const store = fakeStore(state);

      const wrapper = mount(
        <Provider store={store}>
          <ConnectedDashboard />
        </Provider>,
      );

      expect(wrapper.find('tr[data-element-id]').length).to.equal(3);
    });

    it('renders the correct profile information per row', () => {
      const whitelist = ['nomisId', 'surname', 'forename', 'dateOfBirth'];
      const store = fakeStore(state);
      const wrapper = mount(
        <Provider store={store}>
          <ConnectedDashboard />
        </Provider>,
      );

      assertGivenValuesInWhiteListAreInPage(filteredAssessments, whitelist, wrapper);
    });

    it('displays a completed assessments', () => {
      const store = fakeStore(state);
      const wrapper = mount(
        <Provider store={store}>
          <ConnectedDashboard />
        </Provider>,
      );
      const column = wrapper.find('[data-risk-assessment-complete=true]');
      expect(column.length).to.equal(2);
      expect(column.first().text()).to.equal('Complete');
    });

    it('navigates to the risk assessment summary for a completed risk assessment', () => {
      const store = fakeStore(state);
      const wrapper = mount(
        <Provider store={store}>
          <ConnectedDashboard />
        </Provider>,
      );

      wrapper.find('[data-element-id="completed-csra-link-baz-id"]').simulate('click');

      expect(
        store.dispatch.calledWithMatch({
          type: 'SELECT_OFFENDER',
          payload: assessments[2],
        }),
      ).to.equal(true, 'did not call SELECT_OFFENDER action');

      expect(
        store.dispatch.calledWithMatch({
          type: '@@router/CALL_HISTORY_METHOD',
          payload: { method: 'push', args: ['/risk-assessment-summary'] },
        }),
      ).to.equal(true, 'did not navigate to /risk-assessment-summary');
    });

    it('navigates to the healthcare assessment summary for a completed health assessment', () => {
      const store = fakeStore(state);
      const wrapper = mount(
        <Provider store={store}>
          <ConnectedDashboard />
        </Provider>,
      );

      wrapper.find('[data-element-id="completed-healthcare-link-bar-id"]').simulate('click');

      expect(
        store.dispatch.calledWithMatch({
          type: 'SELECT_OFFENDER',
          payload: assessments[1],
        }),
      ).to.equal(true, 'did not call SELECT_OFFENDER action');

      expect(
        store.dispatch.calledWithMatch({
          type: '@@router/CALL_HISTORY_METHOD',
          payload: { method: 'push', args: ['/healthcare-summary'] },
        }),
      ).to.equal(true, 'did not navigate to /healthcare-summary');
    });

    it('displays a completed health assessments', () => {
      const store = fakeStore(state);
      const wrapper = mount(
        <Provider store={store}>
          <ConnectedDashboard />
        </Provider>,
      );
      const column = wrapper.find('[data-health-assessment-complete=true]');
      expect(column.length).to.equal(2);
      expect(column.first().text()).to.equal('Complete');
    });

    it('displays the cell sharing assessment for a completed prisoner assessment', () => {
      const store = fakeStore(state);
      const wrapper = mount(
        <Provider store={store}>
          <ConnectedDashboard />
        </Provider>,
      );
      const row = wrapper.find('[data-assessments-complete=true]');

      expect(row.length).to.equal(1);
      expect(row.text()).to.include('Foo outcome');
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

    context('When a healthcare assessment is incomplete', () => {
      it('responds to the selection of an incomplete health assessment by navigation to the first question', () => {
        const store = fakeStore(state);
        const wrapper = mount(
          <Provider store={store}>
            <ConnectedDashboard />
          </Provider>,
        );
        const profileBtn = wrapper.find('[data-health-assessment-complete=false] > button');

        profileBtn.simulate('click');

        expect(
          store.dispatch.calledWithMatch({
            type: 'SELECT_OFFENDER',
            payload: assessments[2],
          }),
        ).to.equal(true, 'SELECT_OFFENDER dispatch');

        expect(
          store.dispatch.calledWithMatch({
            type: '@@router/CALL_HISTORY_METHOD',
            payload: { method: 'push', args: ['/healthcare-assessment/outcome'] },
          }),
        ).to.equal(true, 'dispatch /healthcare-assessment/outcome');
      });

      context(
        'and the assessment question have already been answered but not submitted',
        () => {
          it('navigates to the the summary page', () => {
            const newStore = fakeStore({
              ...state,
              assessmentStatus: {
                awaitingSubmission: {
                  healthcare: [{ assessmentId: 3 }],
                },
              },
            });
            const wrapper = mount(
              <Provider store={newStore}>
                <ConnectedDashboard />
              </Provider>,
            );

            wrapper.find('[data-health-assessment-complete=false] > button').first().simulate('click');

            expect(
              newStore.dispatch.calledWithMatch({
                type: '@@router/CALL_HISTORY_METHOD',
                payload: {
                  method: 'push',
                  args: ['/healthcare-summary'],
                },
              }),
            ).to.equal(true, 'did not change path to /healthcare-summary');
          });
        },
      );
    });

    context(
      'when an assessment has already been completed but the assessment list has not been refreshed',
      () => {
        it('prevent a risk assessment from being started', () => {
          const store = fakeStore(state);
          const wrapper = mount(
            <Provider store={store}>
              <ConnectedDashboard />
            </Provider>,
          );
          const profileBtn = wrapper.first().find('[data-risk-assessment-complete=false] > button');

          getStub
            .onSecondCall()
            .yields(null, { statusCode: 200 }, { riskAssessment: { foo: 'bar' } });

          profileBtn.simulate('click');

          expect(getStub.callCount).to.equal(2);

          expect(
            store.dispatch.calledWithMatch({
              type: '@@router/CALL_HISTORY_METHOD',
              payload: { method: 'replace', args: ['/error'] },
            }),
          ).to.equal(true, 'did not dispatch /error');
        });

        it('prevent a health assessment from being started', () => {
          const store = fakeStore(state);
          const wrapper = mount(
            <Provider store={store}>
              <ConnectedDashboard />
            </Provider>,
          );
          const profileBtn = wrapper.find('[data-health-assessment-complete=false] > button');

          getStub
            .onSecondCall()
            .yields(null, { statusCode: 200 }, { healthAssessment: { foo: 'bar' } });

          profileBtn.first().simulate('click');

          expect(getStub.callCount).to.equal(2);

          expect(
            store.dispatch.calledWithMatch({
              type: '@@router/CALL_HISTORY_METHOD',
              payload: { method: 'replace', args: ['/error'] },
            }),
          ).to.equal(true, 'did not dispatch /error');
        });
      },
    );
  });
});
