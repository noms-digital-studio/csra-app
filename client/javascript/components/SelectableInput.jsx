import React, { Component } from 'react';
import PropTypes from 'prop-types';

class SelectableInput extends Component {
  constructor(props) {
    super();
    this.state = {
      selected: props.selected,
      focused: props.focused,
    };
  }

  handleChange() {
    this.setState({ selected: !this.state.selected });
  }

  handleBlur() {
    this.setState({ focused: false });
  }

  render() {
    const {
      text,
      id,
      value,
      name,
      type,
      onChange,
      selected,
      required,
    } = this.props;

    const isSelected = onChange ? selected : this.state.selected;
    const onChangeFnc = onChange || (e => this.handleChange(e));

    return (
      <div className="multiple-choice">
        <input
          checked={isSelected}
          data-input={value}
          id={id}
          type={type}
          name={name}
          defaultValue={value}
          required={required}
          onChange={onChangeFnc}
          data-element-id="confirm-checkbox"
        />
        <label data-label={value} htmlFor={id}>{text}</label>
      </div>
    );
  }
}

SelectableInput.propTypes = {
  onChange: PropTypes.func,
  id: PropTypes.string,
  name: PropTypes.string,
  text: PropTypes.string,
  value: PropTypes.string,
  type: PropTypes.string,
  focused: PropTypes.bool,
  selected: PropTypes.bool,
  required: PropTypes.bool,
};

SelectableInput.defaultProps = {
  required: false,
  selected: false,
};

export default SelectableInput;
