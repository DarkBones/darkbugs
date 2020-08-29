import React from 'react'

export default class ApiInput extends React.Component {
  constructor(props) {
    super(props)
  }

  handleKeyDown = (e) => {
    if (event.key === 'Enter') {
      this.props.submit(e)
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
    return (
      <input
        className='form-control'
        defaultValue={this.props.value}
        onKeyDown={this.handleKeyDown}
        ref={(input) => {
          this.inputRef = input
        }}
      />
    )
  }
}
