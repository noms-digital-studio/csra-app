import React, { Component, PropTypes } from 'react';

import SelectableInput from './SelectableInput';

class SelectableInputGroup extends Component {
  constructor(props) {
    super();
    this.state = {
      selectedInputValue: props.default,
    };
  }

  handleInputChange({ target }) {
    this.setState({ selectedInputValue: target.value });
  }

  renderButtons() {
    const { fields, type } = this.props;

    return fields.map(({ name, value, text, required }) => (
      <SelectableInput
        required={required}
        key={`radio-${value}`}
        id={`radio-${value}`}
        name={name}
        value={value}
        type={type}
        text={text}
        selected={this.state.selectedInputValue === value}
        onChange={e => this.handleInputChange(e)}
      />
    ));
  }

  render() {
    return (
      <div>
        {this.renderButtons()}
      </div>
    );
  }
}

SelectableInputGroup.propTypes = {
  default: PropTypes.string,
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      value: PropTypes.string,
      text: PropTypes.string,
      required: PropTypes.bool,
    }),
  ),
  type: PropTypes.string,
};

SelectableInputGroup.defaultProps = {
  type: 'checkbox',
  fields: [],
};

export default SelectableInputGroup;
