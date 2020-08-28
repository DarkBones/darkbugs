import React from 'react'

export default class Title extends React.Component {
  render() {
    return (
      <React.Fragment>
        <h4 className='column-title' onClick={this.handleClick}>
          {this.state.title}
        </h4>
      </React.Fragment>
  )
  }

  constructor(props) {
    super(props)

    this.state = {
      title: props.title,
      isEditing: false
    }
  }

  handleClick = () => {
    alert('EDIT TITLE')
  }
}
