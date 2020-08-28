import React from 'react'
import ApiInput from '../../shared/input/ApiInput'
import { ColumnApi } from '../../../api/InternalApi'

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

  submit = (e) => {
    ColumnApi.updateColumn(this.props.column_uuid, { name: e.target.value })
    this.disableIsEditing()
  }

  disableIsEditing = () => {
    this.setState({
      isEditing: false
    })
  }

  handleChange = (e) => {
    alert(e.target.value)
  }

  render() {
    const title = (
      <h4 className='column-title' onClick={this.handleClick}>
        {this.state.title}
      </h4>
    )

    const titleElement = this.state.isEditing
      ? <ApiInput value={this.state.title} submit={this.submit} />
      : title


    return (
      <div ref={node => this.node = node}>
        {titleElement}
      </div>
    )
  }
}
