import React, { Component, PropTypes } from 'react';
import pluralize from 'pluralize';

class CommentBox extends Component {
  constructor(props) {
    super();
    this.state = {
      charactersLeft: props.limit - props.text.length,
    };
  }

  componentDidMount() {
    if (this.props.autofocus) this.commentBox.focus();
  }

  handleChange(e) {
    this.setState({ charactersLeft: this.props.limit - e.target.value.length });
  }

  render() {
    const { charactersLeft } = this.state;
    const { limit, text, id, name, cssClassName } = this.props;
    const handleChange = e => this.handleChange(e);

    return (
      <div>
        <textarea
          ref={(el) => { this.commentBox = el; }}
          data-element={id}
          onChange={handleChange}
          onPaste={handleChange}
          spellCheck="true"
          maxLength={limit}
          id={id}
          name={name}
          className={cssClassName}
          defaultValue={text}
          cols="20"
          rows="5"
          data-element-id="healthcare-comments-textbox"
        />
        <p className="c-text-hint" data-element-id="character-limit">You have {charactersLeft} {pluralize('character', charactersLeft)} left.</p>
      </div>
    );
  }
}

CommentBox.defaultProps = {
  limit: 300,
  text: '',
  name: '',
  cssClassName: 'form-control',
};

CommentBox.propTypes = {
  id: PropTypes.string,
  limit: PropTypes.number,
  text: PropTypes.string,
  name: PropTypes.string,
  cssClassName: PropTypes.string,
  autofocus: PropTypes.bool,
};

export default CommentBox;
