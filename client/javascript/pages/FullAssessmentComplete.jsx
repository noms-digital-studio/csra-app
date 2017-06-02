import React, { Component, PropTypes } from 'react';
import DocumentTitle from 'react-document-title';
import { connect } from 'react-redux';
import path from 'ramda/src/path';

import PrisonerProfile from '../components/PrisonerProfile';
import RiskAssessmentSummaryTable
  from '../components/connected/RiskAssessmentSummaryTable';
import HealthcareSummaryTable
  from '../components/connected/HealthcareSummaryTable';
import SelectableInput from '../components/SelectableInput';

import routes from '../constants/routes';

class FullAssessmentComplete extends Component {
  componentDidMount() {}
  render() {
    const { title, prisoner } = this.props;
    return (
      <DocumentTitle title={title}>
        <div>
          <h1 className="heading-xlarge">
            Risk and healthcare assessment outcome
          </h1>

          <h2 className="heading-large">
            Recommended outcome: Shared / Single cell
          </h2>

          <PrisonerProfile {...prisoner} />

          <RiskAssessmentSummaryTable title="Risk assessment summary" />

          <div className="u-margin-bottom-large">
            <HealthcareSummaryTable title="Healthcare assessment summary" />
          </div>

          <form>
            <div className="u-clear-fix u-margin-bottom-medium">
              <SelectableInput
                required
                type="checkbox"
                id="confirmation"
                value="accepted"
                text="The outcome has been explained and the prisoner understands."
                name="confirmation"
              />
            </div>

            <button className="button" to={routes.DASHBOARD}>
              Complete Assessment
            </button>
          </form>

        </div>
      </DocumentTitle>
    );
  }
}

FullAssessmentComplete.propTypes = {
  title: PropTypes.string,
  prisoner: PropTypes.shape({
    firstName: PropTypes.string,
    dob: PropTypes.string,
    nomisId: PropTypes.string,
    surname: PropTypes.string,
  }),
};

FullAssessmentComplete.defaultProps = {
  title: 'Assessment Outcome',
  prisoner: {},
};

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  questions: {
    healthcare: state.questions.healthcare,
    riskAssessment: state.questions.riskAssessment,
  },
  prisoner: state.offender.selected,
  prisonerViperScore: '',

  answers: {
    riskAssessment: path(
      [state.answers.selectedPrisonerId],
      state.answers.riskAssessment,
    ),
    healthcare: path(
      [state.answers.selectedPrisonerId],
      state.answers.healthcare,
    ),
  },
});

export default connect(mapStateToProps)(FullAssessmentComplete);
