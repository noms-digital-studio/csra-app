import React, { Component } from 'react';
import PropTypes from 'prop-types';
import serialize from 'form-serialize';

import isEmpty from 'ramda/src/isEmpty';
import not from 'ramda/src/not';

import Comments from '../containers/Comments';
import ConfirmationTemplate from '../containers/Confirmation';
import HealthcareAssessor from '../containers/HealthcareAssessor';
import QuestionWithComments from '../containers/QuestionWithTextBox';
import QuestionWithAsideTemplate from '../containers/QuestionWithAside';
import Viper from '../containers/Viper';

import { capitalize } from '../utils';

function templateSelector(data) {
  switch (data.template) {
    case 'confirmation':
      return <ConfirmationTemplate {...data} />;
    case 'viper':
      return <Viper {...data} />;
    case 'default_with_aside':
      return <QuestionWithAsideTemplate {...data} />;
    case 'default_with_comment':
      return <QuestionWithComments {...data} />;
    case 'comments':
      return <Comments {...data} />;
    case 'healthcare_assessment':
      return <HealthcareAssessor {...data} />;
    default:
      return null;
  }
}

const sectionData = (questions = [], section = '') => {
  if (isEmpty(questions)) {
    return {
      totalSections: 0,
      question: {},
      sectionIndex: 0,
    };
  }
  const sectionEqls = item => item.section === section;
  const index = questions.findIndex(sectionEqls);

  const total = questions.length;
  const question = questions.find(sectionEqls);
  const adJustedIndex = index !== undefined ? index : 0;

  return {
    totalSections: total,
    question,
    sectionIndex: adJustedIndex,
  };
};

class Questionnaire extends Component {
  componentDidMount() {
    this.props.getQuestions();
  }

  handleFormSubmit(event) {
    event.preventDefault();

    const {
      match: { params },
      questions,
      basePath,
      completionPath,
      isComplete,
      prisoner,
    } = this.props;

    const { sectionIndex, question } = sectionData(questions, params.section);
    const answer = serialize(event.target, { hash: true });
    const nextSectionIndex = sectionIndex + 1;

    let nextPath;

    if (questions[nextSectionIndex] && not(isComplete)) {
      nextPath = `${basePath}/${questions[nextSectionIndex].section}`;
    } else {
      nextPath = completionPath;
    }

    this.props.onSubmit({
      prisoner,
      question,
      section: question.section,
      answer,
      nextPath,
    });
  }

  render() {
    const {
      answers,
      questions,
      prisonerViperScore,
      completionPath,
      isComplete,
      match: { params },
      prisoner: { forename, surname },
    } = this.props;

    const { section } = params;

    const { question } = sectionData(questions, section);

    return (
      <div className="o-question">
        <div className="">
          <h3 className="bold-medium" id="subsection-title">
            <span className="u-font-weight-normal">Assessment for:</span>{' '}
            {capitalize(forename)} {capitalize(surname)}
          </h3>
        </div>

        {templateSelector({
          section,
          isComplete,
          completionPath,
          ...question,
          onSubmit: e => this.handleFormSubmit(e),
          formDefaults: answers[section],
          viperScore: prisonerViperScore,
        })}
      </div>
    );
  }
}

Questionnaire.propTypes = {
  basePath: PropTypes.string,
  completionPath: PropTypes.string,
  prisonerViperScore: PropTypes.string,
  answers: PropTypes.object,
  questions: PropTypes.array,
  match: PropTypes.object,
  prisoner: PropTypes.object,
  getQuestions: PropTypes.func,
  onSubmit: PropTypes.func,
  isComplete: PropTypes.bool,
};

Questionnaire.defaultProps = {
  answers: {},
  questions: [],
  match: {
    params: {
      section: '',
    },
  },
  prisoner: {},
  prisonerViperScore: '',
  getQuestions: () => {},
  onSubmit: () => {},
  isComplete: false,
};

export default Questionnaire;
