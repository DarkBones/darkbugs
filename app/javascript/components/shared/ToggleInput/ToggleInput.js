import ApiInput   from '../ApiInput';
import React      from 'react';
import PropTypes  from 'prop-types';

export default class ToggleInput extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isEditing: props.isEditing
    };
  }

  handleSubmit = data => {
    const { setIsEditing } = this;
    const {
      allowBlank,
      handleOnSubmit,
      value
    } = this.props;

    setIsEditing(false);

    // Return if data hasn't changed or is blank when not allowed
    if ((!data || data.toString().length === 0) && !allowBlank) return;
    if (data === value && data.length > 0) return;
    
    handleOnSubmit(data);
  }

  handleCancel = () => {
    const { handleOnCancel } = this.props;

    this.setIsEditing(false);
    handleOnCancel();
  }

  handleOnClick = e => {
    const { props, toggleInput } = this;
    const { isEnabled, toggleOnClick } = props;

    if (!isEnabled) return;

    if (toggleInput && toggleInput.contains(e.target)) {
      if (toggleOnClick) this.setIsEditing(true);
    } else {
      this.setIsEditing(false);
      this.handleCancel();
    }
  }

  setIsEditing = (isEditing) => {
    if(!this.mounted) return;

    this.setState({
      isEditing: isEditing
    });
  }

  componentDidMount() {
    document.addEventListener(this.props.triggerOn, this.handleOnClick);
    this.mounted = true;
  }

  componentWillUnmount() {
    document.removeEventListener(this.props.triggerOn, this.handleOnClick);
    this.mounted = false;
  }

  componentDidUpdate = prevProps => {
    if (prevProps.isEditing !== this.props.isEditing) {
      this.setState({
        isEditing: this.props.isEditing
      });
    }
  }

  render() {
    const input = (
      <ApiInput
        handleCancel= {this.handleCancel}
        handleSubmit= {this.handleSubmit}
        value=        {this.props.value}
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
  allowBlank:     PropTypes.bool.isRequired,
  handleOnSubmit: PropTypes.func.isRequired,
  handleOnCancel: PropTypes.func,
  isEditing:      PropTypes.bool.isRequired,
  isEnabled:      PropTypes.bool.isRequired,
  toggleOnClick:  PropTypes.bool.isRequired,
  triggerOn:      PropTypes.string.isRequired,
  value:          PropTypes.oneOfType([
                    PropTypes.string,
                    PropTypes.number
                  ]).isRequired
};

ToggleInput.defaultProps = {
  allowBlank:     false,
  isEditing:      false,
  isEnabled:      true,
  toggleOnClick:  true,
  triggerOn:      'mousedown',
  value:          ''
};