import React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import path from 'ramda/src/path';

import {
  getHealthAssessmentQuestions,
  saveHealthcareAssessmentAnswer,
} from '../actions';

import Questionnaire from '../components/Questionnaire';

import routes from '../constants/routes';

const HealthcareAssessment = props => (
  <Questionnaire
    basePath={routes.HEALTHCARE_ASSESSMENT}
    completionPath={routes.HEALTHCARE_SUMMARY}
    {...props}
  />
);

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  questions: state.questions.healthcare,
  prisoner: {
    firstName: state.offender.selected.firstName,
    surname: state.offender.selected.surname,
  },
  prisonerViperScore: '',
  answers: path([state.answers.selectedPrisonerId], state.answers.healthcare),
  isComplete: Boolean(
    state.healthcareStatus.awaitingSubmission.find(
      prisoner => prisoner.nomisId === state.offender.selected.nomisId,
    )
  ),
});

const mapActionsToProps = dispatch => ({
  getQuestions: () => {
    dispatch(getHealthAssessmentQuestions());
  },
  onSubmit: ({ section, answer, nextPath }) => {
    dispatch(saveHealthcareAssessmentAnswer(section, answer));
    dispatch(push(nextPath));
  },
});

export default connect(mapStateToProps, mapActionsToProps)(
  HealthcareAssessment,
);
