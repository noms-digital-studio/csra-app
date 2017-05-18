/* eslint no-trailing-spaces: ["error", { "skipBlankLines": true }]*/

describe('add prisoner', () => {
  before(() => {
    browser.url('/');
  });

  it('adds a new prisoner', () => {
    expect(browser.getText('h1')).to.equal('Your full name');

    browser.setValue('[data-username]', 'officer1');
    browser.click('[data-sign-in-button]');
    expect(browser.getText('[data-header-username]')).to.equal('officer1');
    expect(browser.getText('h1')).to.equal('Cell sharing risk assessment');

    browser.click('[data-before-you-start-button]');
    expect(browser.getText('h1')).to.contain('Prisoners to assess on:');

    browser.click('[data-add-prisoner-button]');
    expect(browser.getText('h1')).to.contain('Add Prisoner');

    browser.setValue('[data-first-name]', 'Henri');
    browser.setValue('[data-last-name]', 'Young');
    browser.setValue('[data-dob-day]', '23');
    browser.setValue('[data-dob-month]', '5');
    browser.setValue('[data-dob-year]', '1975');
    browser.setValue('[data-nomis-id]', 'A12345');
    browser.click('[data-add-prisoner-button]');
    expect(browser.getText('h1')).to.contain('Prisoner Added');
    expect(browser.getText('[data-prisoner-name]')).to.equal('Henri Young');
    expect(browser.getText('[data-prisoner-dob]')).to.equal('23-5-1975');
    expect(browser.getText('[data-prisoner-nomis-id]')).to.equal('A12345');

    browser.click('[data-confirm-button]');
    expect(browser.getText('h1')).to.contain('Prisoners to assess on:');

    browser.pause(10000);
  });
});
