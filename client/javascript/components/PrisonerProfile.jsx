import React from 'react';

const PrisonerProfile = ({ firstName, surname, dob, nomisId }) => (
  <div data-profile>
    <h2 className="heading-medium">Prisoner Details</h2>
    <p>
      Prisoner Name:
      {' '}
      <strong className="heading-small">
        <span data-prisoner-name>
          {firstName} {surname}
        </span>
      </strong>
    </p>
    <p>
      Date of Birth:
      {' '}
      <strong className="heading-small">
        <span data-prisoner-dob>{dob}</span>
      </strong>
    </p>
    <p>
      NOMIS ID:
      {' '}
      <strong className="heading-small">
        <span data-prisoner-nomis-id>{nomisId}</span>
      </strong>
    </p>
  </div>
);

export default PrisonerProfile;
