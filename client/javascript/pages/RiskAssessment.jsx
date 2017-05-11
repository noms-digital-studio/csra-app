import React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import path from 'ramda/src/path';
import not from 'ramda/src/not';

import { calculateRiskFor } from '../services';
import { getAssessmentQuestions, saveRiskAssessmentAnswer, saveExitPoint } from '../actions';

import Questionnaire from '../components/Questionnaire';

import routes from '../constants/routes';

const Assessment = props => (
  <Questionnaire
    basePath={routes.ASSESSMENT}
    completionPath={routes.ASSESSMENT_COMPLETE}
    {...props}
  />
);

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  questions: state.questions.csra,
  prisoner: {
    firstName: state.offender.selected.First_Name,
    surname: state.offender.selected.Surname,
  },
  prisonerViperScore: calculateRiskFor(
    state.offender.selected.NOMS_Number,
    state.offender.viperScores,
  ),
  answers: path([state.answers.selectedPrisonerId], state.answers.csra),
});

const mapActionsToProps = dispatch => ({
  getQuestions: () => {
    dispatch(getAssessmentQuestions());
  },
  onSubmit: ({ section, answer, nextPath, canContinue }) => {
    dispatch(saveRiskAssessmentAnswer(section, answer));

    if (not(canContinue)) {
      dispatch(saveExitPoint(section));
    }

    dispatch(push(nextPath));
  },
});

export default connect(mapStateToProps, mapActionsToProps)(Assessment);
