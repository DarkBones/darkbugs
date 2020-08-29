import React from 'react'
import ApiInput from '../../shared/input/ApiInput'
import { ColumnApi } from '../../../api/InternalApi'

export default class Name extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      name: props.name,
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

  submit = async (e) => {
    let response = await ColumnApi
      .updateColumn(
        this.props.column_uuid,
        { name: e.target.value }
      ).catch(() => {
        this.setState({
          isEditing: false
        })
      })

    if (typeof(response) !== 'undefined') {
      this.setState({
        name: response.data.name,
        isEditing: false
      })
    }
  }

  handleChange = (e) => {
    alert(e.target.value)
  }

  render() {
    const name = (
      <h4 className='column-name' onClick={this.handleClick}>
        {this.state.name}
      </h4>
    )

    const nameElement = this.state.isEditing
      ? <ApiInput value={this.state.name} submit={this.submit} />
      : name


    return (
      <div ref={node => this.node = node}>
        {nameElement}
      </div>
    )
  }
}
