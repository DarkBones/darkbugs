import React from 'react'
import PropTypes from 'prop-types'

export default class ApiInput extends React.Component {
  constructor(props) {
    super(props)
  }

  handleKeyDown = (e) => {
    const { handleSubmit, handleCancel } = this.props

    if (event.key === 'Enter') {
      handleSubmit(e)
    } else if (event.key === 'Escape') {
      handleCancel(e)
    }
  }

  componentDidMount(){
    if (this.props.focus) {
      setTimeout(() => {
        this.inputRef.focus()
      }, 1)
    }
  }

  render() {
    const { value, handleOnChange, name, placeholder } = this.props

    return (
      <input
        className=  "form-control"
        value=      {value}
        onKeyDown=  {this.handleKeyDown}
        onChange=   {handleOnChange}
        name=       {name}
        placeholder={placeholder}
        ref=        {(input) => {
          this.inputRef = input
        }}
      />
    )
  }
}

ApiInput.propTypes = {
  focus:          PropTypes.bool.isRequired,
  handleCancel:   PropTypes.func,
  handleOnChange: PropTypes.func,
  handleSubmit:   PropTypes.func.isRequired,
  name:           PropTypes.string.isRequired,
  placeholder:    PropTypes.string,
  value:          PropTypes.string.isRequired
}
