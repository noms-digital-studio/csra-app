import React from 'react';
import DocumentTitle from 'react-document-title';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import path from 'ramda/src/path';

import { riskFromViperScore } from '../services';
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
  prisoner: state.offender.selected,
  prisonerViperScore: riskFromViperScore(path([state.offender.selected.id, 'viperScore'], state.assessments.risk),),
  answers: path(
    [state.offender.selected.id, 'questions'],
    state.assessments.risk,
  ),
  isComplete: Boolean(state.assessmentStatus.awaitingSubmission.risk.find(item => item.assessmentId === state.offender.selected.id,),),
});

const mapActionsToProps = dispatch => ({
  getQuestions: () => {
    dispatch(getRiskAssessmentQuestions());
  },
  onSubmit: ({
 answer, nextPath, question, prisoner 
}) => {
    dispatch(saveRiskAssessmentAnswer({ id: prisoner.id, question, answer }));
    dispatch(push(nextPath));
  },
});

export default connect(
  mapStateToProps,
  mapActionsToProps,
)(Assessment);
