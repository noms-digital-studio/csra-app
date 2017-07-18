import React from 'react';

const PrisonerProfile = ({ firstName, surname, dob, nomisId }) => (
  <div data-element-id="prisoner-profile">
    <h2 className="heading-medium">Prisoner Details</h2>
    <p>
      Prisoner Name:
      {' '}
      <strong className="heading-small">
        <span data-element-id="prisoner-name">
          {firstName} {surname}
        </span>
      </strong>
    </p>
    <p>
      Date of Birth:
      {' '}
      <strong className="heading-small">
        <span data-element-id="prisoner-dob">{dob}</span>
      </strong>
    </p>
    <p>
      NOMIS ID:
      {' '}
      <strong className="heading-small">
        <span data-element-id="nomis-id">{nomisId}</span>
      </strong>
    </p>
  </div>
);

export default PrisonerProfile;
