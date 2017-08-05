import React, { Component, PropTypes } from 'react';
import uuid from 'uuid/v4';

import Aside from '../components/asides/Index';

import { splitAssessorValues } from '../services';

class HealthAssessment extends Component {
  componentDidMount() {
    this.roleInput.focus();
  }

  render() {
    const { title, aside, onSubmit, formDefaults, isComplete } = this.props;

    const assessor = splitAssessorValues(formDefaults.answer);

    return (
      <div className="grid-row">
        <div className="column-two-thirds">
          <form key={uuid()} action="/" method="post" className="form" onSubmit={onSubmit}>
            <h1 data-title={title} className="heading-large">
              {title}
            </h1>

            <div className="form-group">
              <label htmlFor="role" className="form-label-bold">
                Role / Position
              </label>
              <input
                className="form-control form-control-3-4"
                type="text"
                name="assessor[role]"
                defaultValue={assessor.role}
                required
                data-element-id="role"
                ref={(el) => {
                  this.roleInput = el;
                }}
              />
            </div>

            <div className="form-group">
              <label htmlFor="full-name" className="form-label-bold">
                Full name
              </label>
              <input
                className="form-control form-control-3-4"
                type="text"
                name="assessor[full-name]"
                defaultValue={assessor.fullName}
                required
                data-element-id="full-name"
              />
            </div>

            <div className="form-date u-clear-fix u-margin-bottom-bravo">
              <span className="form-label-bold">Date Completed</span>
              <span className="form-hint" id="hint">
                For example, 31 3 1980
              </span>
              <div className="form-group form-group-day">
                <label className="form-label" htmlFor="day">
                  Day
                </label>
                <input
                  className="form-control"
                  id="day"
                  name="assessor[day]"
                  type="number"
                  pattern="[0-9]*"
                  min="0"
                  max="31"
                  aria-describedby="hint"
                  defaultValue={assessor.day}
                  required
                  data-element-id="day"
                />
              </div>
              <div className="form-group form-group-month">
                <label className="form-label" htmlFor="month">
                  Month
                </label>
                <input
                  className="form-control"
                  id="month"
                  name="assessor[month]"
                  type="number"
                  pattern="[0-9]*"
                  min="0"
                  max="12"
                  defaultValue={assessor.month}
                  required
                  data-element-id="month"
                />
              </div>
              <div className="form-group form-group-year">
                <label className="form-label" htmlFor="year">
                  Year
                </label>
                <input
                  className="form-control"
                  id="year"
                  name="assessor[year]"
                  type="number"
                  pattern="[0-9]*"
                  min="0"
                  max="2017"
                  defaultValue={assessor.year}
                  required
                  data-element-id="year"
                />
              </div>
            </div>

            <div className="form-group">
              <input
                type="submit"
                className="button"
                value={isComplete ? 'Save' : 'Save and continue'}
                data-element-id="continue-button"
              />
            </div>
          </form>
        </div>
        <div className="column-third">
          <Aside {...aside} />
        </div>
      </div>
    );
  }
}

HealthAssessment.propTypes = {
  title: PropTypes.string,
  aside: PropTypes.object,
  onSubmit: PropTypes.func,
  formDefaults: PropTypes.shape({
    role: PropTypes.string,
    'full-name': PropTypes.string,
    day: PropTypes.string,
    month: PropTypes.string,
    year: PropTypes.string,
  }),
  isComplete: PropTypes.bool,
};

HealthAssessment.defaultProps = {
  formDefaults: {
    answer: ` , , ${new Date().getDate()}-${new Date().getMonth() + 1}-${new Date().getFullYear()}`,
  },
};

export default HealthAssessment;
