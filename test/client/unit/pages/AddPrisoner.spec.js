import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter as Router } from 'react-router-dom';
import { mount } from 'enzyme';
import xhr from 'xhr';

import { fakeStore } from '../test-helpers';

import ConnectedAddPrisoner from '../../../../client/javascript/pages/AddPrisoner';


const mountApp = store => mount(
  <Provider store={store}>
    <Router>
      <ConnectedAddPrisoner />
    </Router>
  </Provider>,
);

const bookings = [{
  bookingId: 123,
  offenderNo: 'foo-nomis-id',
  firstName: 'foo',
  middleName: 'bar',
  lastName: 'baz',
  dateOfBirth: '09-12-1921',
  facialImageId: null,
}];

describe('<AddPrisoner />', () => {
  context('Connected AddPrisoner', () => {
    context('When a search is performed', () => {
      let getStub;

      beforeEach(() => {
        getStub = sinon.stub(xhr, 'get');
        getStub.yields(
          null,
          { statusCode: 200 },
          bookings,
        );
      });

      afterEach(() => {
        getStub.restore();
      });

      it('calls storeSearchResults callback when form submits successfully', () => {
        const store = fakeStore({
          offender: {
            searchResults: [],
          },
        });

        const wrapper = mountApp(store);

        const node = wrapper.find('input[type="text"]').getDOMNode();
        node.value = 'SOME-NOMIS-ID';

        wrapper.find('form').simulate('submit');

        expect(store.dispatch.calledWithMatch({ type: 'STORE_PRISONER_SEARCH_RESULTS', payload: bookings })).to.equal(true, 'Did not dispatch STORE_PRISONER_SEARCH_RESULTS');
      });
    });

    context('When a search results are available', () => {
      it('displays the search results', () => {
        const store = fakeStore({
          offender: {
            searchResults: bookings,
          },
        });

        const wrapper = mountApp(store);

        const resultsTable = wrapper.find('table');

        expect(resultsTable.length).equal(1);

        const tableRow = resultsTable.find('tbody > tr');
        const tableRowText = tableRow.text();

        expect(tableRowText).to.include('Foo Bar Baz');
        expect(tableRowText).to.include('foo-nomis-id');
        expect(tableRowText).to.include('12 September 1921');
      });

      context('and a result is selected', () => {
        let postStub;

        beforeEach(() => {
          postStub = sinon.stub(xhr, 'post');
        });

        afterEach(() => {
          postStub.restore();
        });

        it('adds the prisoner for assessment', () => {
          const store = fakeStore({
            offender: {
              searchResults: bookings,
            },
          });

          const wrapper = mountApp(store);

          const button = wrapper.find('button[data-element-id="foo-nomis-id"]');

          postStub.yields(null, { status: 200 }, { id: 1 });

          button.simulate('click');

          expect(
            store.dispatch.calledWithMatch({
              type: '@@router/CALL_HISTORY_METHOD',
              payload: { method: 'replace', args: ['/prisoner-list'] },
            }),
          ).to.equal(true, 'did not navigate to /prisoner-list');
        });

        context('and an error occurs', () => {
          it('navigates to an error page', () => {
            const store = fakeStore({
              offender: {
                searchResults: bookings,
              },
            });

            const wrapper = mountApp(store);

            const button = wrapper.find('button[data-element-id="foo-nomis-id"]');

            postStub.yields(null, { status: 500 });

            button.simulate('click');

            expect(
              store.dispatch.calledWithMatch({
                type: '@@router/CALL_HISTORY_METHOD',
                payload: { method: 'replace', args: ['/error'] },
              }),
            ).to.equal(true, 'did not navigate to /error');
          });
        });
      });
    });
  });
});
