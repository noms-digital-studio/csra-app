import React from 'react';
import DocumentTitle from 'react-document-title';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import path from 'ramda/src/path';

import { calculateRiskFor } from '../services';
import {
  getRiskAssessmentQuestions,
  saveRiskAssessmentAnswer,
} from '../actions';

import Questionnaire from '../components/Questionnaire';

import routes from '../constants/routes';

const Assessment = props => (
  <DocumentTitle title={props.title}>
    <Questionnaire
      basePath={routes.RISK_ASSESSMENT}
      completionPath={routes.RISK_ASSESSMENT_SUMMARY}
      {...props}
    />
  </DocumentTitle>
);

Assessment.defaultProps = {
  title: 'Risk assessment',
};

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  questions: state.questions.riskAssessment,
  prisoner: {
    firstName: state.offender.selected.firstName,
    surname: state.offender.selected.surname,
  },
  prisonerViperScore: calculateRiskFor(
    state.offender.selected.nomisId,
    state.offender.viperScores,
  ),
  answers: path([state.answers.selectedPrisonerId], state.answers.riskAssessment),
});

const mapActionsToProps = dispatch => ({
  getQuestions: () => {
    dispatch(getRiskAssessmentQuestions());
  },
  onSubmit: ({ section, answer, nextPath }) => {
    dispatch(saveRiskAssessmentAnswer(section, answer));

    dispatch(push(nextPath));
  },
});

export default connect(mapStateToProps, mapActionsToProps)(Assessment);
