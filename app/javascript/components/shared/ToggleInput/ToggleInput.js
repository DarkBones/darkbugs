import ApiInput from "../ApiInput";
import React from "react";
import PropTypes from "prop-types";

export default class ToggleInput extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isEditing: props.isEditing
    };
  }

  handleSubmit = data => {
    const { setIsEditing } = this
    const {
      allowBlank,
      handleOnSubmit,
      value
    } = this.props;

    setIsEditing(false);

    // Return if data hasn't changed or is blank when not allowed
    if ((!data || data.toString().length === 0) && !allowBlank) return;
    if (data === value) return;

    handleOnSubmit(data);
  }

  handleOnClick = e => {
    const { toggleInput } = this;
    const { isEnabled, toggleOnClick} = this.props;

    if (!isEnabled) return;

    let isEditing = toggleInput
      && toggleInput.contains(e.target);

    if (isEditing && !toggleOnClick) return;

    this.setIsEditing(isEditing);
  }

  setIsEditing = isEditing => {
    const { handleOnCancel } = this.props;

    if (this.state.isEditing && !isEditing && handleOnCancel) handleOnCancel();

    if(!this.mounted) return;

    this.setState({
      isEditing: isEditing
    });
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleOnClick);
    this.mounted = true;
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleOnClick);
    this.mounted = false;
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

    const el = this.state.isEditing && this.props.isEnabled
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
  isEnabled:      PropTypes.bool,
  toggleOnClick:  PropTypes.bool,
  value:          PropTypes.oneOfType([
                    PropTypes.string,
                    PropTypes.number
                  ])
};

ToggleInput.defaultProps = {
  allowBlank:     false,
  isEditing:      false,
  isEnabled:      true,
  toggleOnClick:  true,
  value:          ''
}