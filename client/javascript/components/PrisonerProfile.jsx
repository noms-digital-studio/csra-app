import React, { PropTypes } from 'react';
import { capitalize, extractDateFromString } from '../utils';


const PrisonerProfile = ({ forename, surname, dateOfBirth, nomisId }) => (
  <div className="o-offender-profile u-clear-fix">
    <div className="c-offender-image">
      <img src="/assets/images/profile-placeholder.gif" />
    </div>
    <div
      data-offender-profile-details
      className="c-offender-details"
    >
      <table data-element-id="prisoner-profile">
        <tbody>
          <tr>
            <th className="heading-small" colSpan="2">Prisoner Details</th>
          </tr>
          <tr>
            <td>Full name</td>
            <td data-element-id="prisoner-name">
              <strong className="heading-small">{capitalize(`${forename} ${surname}`)}</strong>
            </td>
          </tr>
          <tr>
            <td>Date of birth:</td>
            <td data-element-id="prisoner-dob">
              <strong className="heading-small">{extractDateFromString(dateOfBirth)}</strong>
            </td>
          </tr>
          <tr>
            <td>NOMISID:</td>
            <td data-element-id="prisoner-nomis-id">
              <strong className="heading-small">{nomisId}</strong>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
);


PrisonerProfile.propTypes = {
  forename: PropTypes.string,
  surname: PropTypes.string,
  dateOfBirth: PropTypes.string,
  nomisId: PropTypes.string,
};

PrisonerProfile.defaultProps = {
  dateOfBirth: '',
};

export default PrisonerProfile;
