import ApiInput from "../ApiInput";
import React from "react";
import PropTypes from "prop-types";

export default class ToggleInput extends React.Component {
  constructor(props) {
    super(props);

    const { isEditing, value } = props;

    this.state = {
      isEditing: isEditing,
      value: value
    };
  }

  handleSubmit = data => {
    const { setIsEditing } = this
    const {
      allowBlank,
      handleOnSubmit
    } = this.props

    setIsEditing(false);

    // Return if data hasn't changed or is blank when not allowed
    if ((!data || data.length === 0) && !allowBlank) return;
    if (data === this.state.value) return;

    handleOnSubmit(data);
  }

  handleOnClick = e => {
    const { toggleInput, props } = this;

    let isEditing = toggleInput
      && toggleInput.contains(e.target);

    if (isEditing && !props.toggleOnClick) return;

    this.setIsEditing(isEditing);
  }

  setIsEditing = isEditing => {
    const { handleOnCancel } = this.props;

    if (!isEditing && handleOnCancel) handleOnCancel();

    this.setState({
      isEditing: isEditing
    });
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleOnClick);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleOnClick);
  }

  componentDidUpdate = prevProps => {
    if (prevProps.isEditing !== this.props.isEditing) {
      this.setState({
        isEditing: this.props.isEditing
      })
    }
  }

  render() {
    const input = (
      <ApiInput
        handleCancel={() => {this.setIsEditing(false);}}
        handleSubmit={this.handleSubmit}
        value={this.props.value}
      />
    );

    const element = (
      <div>
        {this.props.children}
      </div>
    );

    const el = this.state.isEditing
      ? input
      : element

    return (
      <div
        ref={(toggleInput) => {
          this.toggleInput = toggleInput
        }}
      >
        { el }
      </div>
    )
  }
}

ToggleInput.propTypes = {
  allowBlank:     PropTypes.bool,
  handleOnSubmit: PropTypes.func.isRequired,
  handleOnCancel: PropTypes.func,
  isEditing:      PropTypes.bool,
  toggleOnClick:  PropTypes.bool,
  value:          PropTypes.oneOfType([
                    PropTypes.string,
                    PropTypes.number
                  ])
};

ToggleInput.defaultProps = {
  allowBlank:     false,
  isEditing:      false,
  toggleOnClick:  true,
  value:          ''
}