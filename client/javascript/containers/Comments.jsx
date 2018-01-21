import React from 'react';
import PropTypes from 'prop-types';

import uuid from 'uuid/v4';
import Aside from '../components/asides/Index';
import CommentBox from '../components/CommentBox';

const Comments = ({
  title,
  description,
  onSubmit,
  aside,
  formDefaults: { answer },
  isComplete,
  section,
}) => (
  <div className="grid-row">
    <div className="column-two-thirds">
      <form
        key={uuid()}
        action="/"
        method="post"
        className="form"
        onSubmit={onSubmit}
      >
        <h1 data-title={section} className="heading-large">{title}</h1>
        <p className="lede text c-text-hint">{description}</p>
        <CommentBox
          id="commentBox"
          limit={300}
          text={answer}
          name="comments"
          cssClassName="form-control form-control-3-4 u-margin-bottom-default"
        />
        <p>
          <input
            type="submit"
            className="button"
            value={isComplete ? 'Save' : 'Save and continue'}
            data-element-id="continue-button"
          />
        </p>
      </form>
    </div>
    {Object.keys(aside).length
      ? <div className="column-third">
        <Aside {...aside} />
      </div>
      : null}
  </div>
);

Comments.propTypes = {
  section: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  aside: PropTypes.object,
  onSubmit: PropTypes.func,
  formDefaults: PropTypes.shape({
    answer: PropTypes.string,
  }),
  isComplete: PropTypes.bool,
};

Comments.defaultProps = {
  formDefaults: {
    answer: '',
  },
  aside: {},
};

export default Comments;
