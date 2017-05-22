import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';

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
      <span className="multiple-choice">
        <input
          checked={isSelected}
          data-input={value}
          id={id}
          type={type}
          name={name}
          defaultValue={value}
          required={required}
          onChange={onChangeFnc}
          data-confirm-checkbox
        />
        <label data-label={value} htmlFor={id}>{text}</label>
      </span>
    );
  }
}

SelectableInput.propType = {
  onChange: PropTypes.func,
  id: PropTypes.string,
  name: PropTypes.string,
  text: PropTypes.string,
  selected: PropTypes.bool,
  required: PropTypes.bool,
};

SelectableInput.defaultProps = {
  required: false,
  selected: false,
};

export default SelectableInput;
