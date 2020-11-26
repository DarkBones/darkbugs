import React      from 'react'
import PropTypes  from 'prop-types'

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
        this.inputRef.focus()
      }, 1);
    }
  }

  handleOnKeyDown = e => {
    const { handleSubmit, handleCancel, name } = this.props

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
        className="form-control"
        value={this.state[name]}
        onKeyDown={handleOnKeyDown}
        onChange={handleOnChange}
        name={name}
        ref={(input) => {
          this.inputRef = input
        }}
      />
    )
  }
}

ApiInput.propTypes = {
  focus:        PropTypes.bool,
  handleCancel: PropTypes.func,
  handleSubmit: PropTypes.func.isRequired,
  name:         PropTypes.string,
  value:        PropTypes.oneOfType([
                  PropTypes.string,
                  PropTypes.number
                ])
}

ApiInput.defaultProps = {
  focus:  true,
  name:   'value',
  value:  ''
}