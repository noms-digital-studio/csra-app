import React, { PropTypes } from 'react';
import { capitalize, extractDateFromString } from '../utils';


const PrisonerProfile = ({ firstName, surname, dob, nomisId }) => (
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
            <th colSpan="2">Prisoner Details</th>
          </tr>
          <tr>
            <td>Full name</td>
            <td data-element-id="prisoner-name">
              <strong className="heading-small">{capitalize(`${firstName} ${surname}`)}</strong>
            </td>
          </tr>
          <tr>
            <td>Date of birth:</td>
            <td data-element-id="prisoner-dob">
              <strong className="heading-small">{extractDateFromString(dob)}</strong>
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
  firstName: PropTypes.string,
  surname: PropTypes.string,
  dob: PropTypes.string,
  nomisId: PropTypes.string,
};

PrisonerProfile.defaultProps = {
  dob: '',
};

export default PrisonerProfile;
