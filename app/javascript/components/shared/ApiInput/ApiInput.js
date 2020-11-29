import PropTypes  from 'prop-types';
import React      from 'react';

export default class ApiInput extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      [props.name]: props.value
    };
  }
  
  componentDidMount = () => {
    if (this.props.focus) {
      setTimeout(() => {
        this.inputRef.focus();
      }, 1);
    }
  }

  handleOnKeyDown = e => {
    const { handleSubmit, handleCancel, name } = this.props;

    if (e.key === 'Enter') {
      handleSubmit(this.state[name]);
    } else if (e.key === 'Escape') {
      if (handleCancel) handleCancel();
    }
  }

  handleOnChange = e => {
    const { name, value } = e.target;

    this.setState({
      [name]: value
    });
  }

  render() {
    const { handleOnChange, handleOnKeyDown } = this;
    const { name } = this.props;

    return (
      <input
        className=  "form-control"
        value=      {this.state[name]}
        onKeyDown=  {handleOnKeyDown}
        onChange=   {handleOnChange}
        name=       {name}
        ref=        {(input) => {
                      this.inputRef = input
                    }}
      />
    );
  }
}

ApiInput.propTypes = {
  focus:        PropTypes.bool.isRequired,
  handleCancel: PropTypes.func,
  handleSubmit: PropTypes.func.isRequired,
  name:         PropTypes.string.isRequired,
  value:        PropTypes.oneOfType([
                  PropTypes.string,
                  PropTypes.number
                ]).isRequired
};

ApiInput.defaultProps = {
  focus:  true,
  name:   "value",
  value:  ""
};