import React, { PropTypes } from 'react';
import { capitalize, extractDateFromUTCString } from '../utils';


const PrisonerProfile = ({ forename, surname, dateOfBirth, nomisId, image }) => (
  <div className="o-offender-profile u-clear-fix">
    <div className="c-offender-image">
      {(image)
        ? <img src={image} alt={forename} />
        : <img src="/assets/images/profile-placeholder.gif" />
      }
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
              <strong className="heading-small">{capitalize(forename)} {capitalize(surname)}</strong>
            </td>
          </tr>
          <tr>
            <td>Date of birth:</td>
            <td data-element-id="prisoner-dob">
              <strong className="heading-small">{extractDateFromUTCString(dateOfBirth)}</strong>
            </td>
          </tr>
          <tr>
            <td>NOMIS ID:</td>
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
  image: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
};

PrisonerProfile.defaultProps = {
  dateOfBirth: '',
};

export default PrisonerProfile;
