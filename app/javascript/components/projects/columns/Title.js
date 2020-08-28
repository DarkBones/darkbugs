import React from 'react'

export default class Title extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      title: props.title,
      isEditing: false
    }
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClick);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClick);
  }

  handleClick = (e) => {
    this.setState({
      isEditing: this.node.contains(e.target)
    })
  }

  render() {
    const title = (
      <h4 className='column-title' onClick={this.handleClick}>
        {this.state.title}
      </h4>
    )

    const titleElement = this.state.isEditing
      ? <input className='form-control' value={this.state.title} />
      : title


    return (
      <div ref={node => this.node = node}>
        {titleElement}
      </div>
    )
  }
}
