import React from 'react';
import DocumentTitle from 'react-document-title';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import path from 'ramda/src/path';

import { getHealthAssessmentQuestions, saveHealthcareAssessmentAnswer } from '../actions';

import Questionnaire from '../components/Questionnaire';

import routes from '../constants/routes';

const HealthcareAssessment = props =>
  <DocumentTitle title={props.title}>
    <Questionnaire
      basePath={routes.HEALTHCARE_ASSESSMENT}
      completionPath={routes.HEALTHCARE_SUMMARY}
      {...props}
    />
  </DocumentTitle>;

HealthcareAssessment.defaultProps = {
  title: 'Healthcare Assessment',
};

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  questions: state.questions.healthcare,
  prisoner: state.offender.selected,
  prisonerViperScore: '',
  answers: path([state.offender.selected.id, 'questions'], state.assessments.healthcare),
  isComplete: Boolean(
    state.healthcareStatus.awaitingSubmission.find(
      item => item.assessmentId === state.offender.selected.id,
    ),
  ),
});

const mapActionsToProps = dispatch => ({
  getQuestions: () => {
    dispatch(getHealthAssessmentQuestions());
  },
  onSubmit: ({ answer, nextPath, question, prisoner }) => {
    dispatch(saveHealthcareAssessmentAnswer({ id: prisoner.id, question, answer }));
    dispatch(push(nextPath));
  },
});

export default connect(mapStateToProps, mapActionsToProps)(HealthcareAssessment);
