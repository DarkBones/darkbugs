import React from 'react'
import ApiInput from '../../shared/input/ApiInput'
import { ColumnApi } from '../../../api/InternalApi'

export default class Name extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      name: props.name,
      isEditing: props.isNew,
      isNew: props.isNew
    }
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClick);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClick);
  }

  handleClick = (e) => {
    const clickedInside = this.node.contains(e.target)
    if (this.props.userIsAdmin) {
      this.setState({
        isEditing: clickedInside
      })
    }

    if (!clickedInside && this.state.isNew) {
      this.props.cancelNewColumns()
    }
  }

  handleSubmitUpdate = async (e) => {
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

  handleSubmitCreate = async (e) => {
    let response = await ColumnApi
      .createColumn(
        this.props.boardSlug,
        { name: e.target.value }
      ).catch(() => {
        this.props.cancelNewColumns()
      })

    if (typeof(response) !== 'undefined') {
      this.props.saveNewColumn(response.data.uuid, response.data.name)
    }
  }

  handleSubmit = (e) => {
    if (this.state.isNew) {
      this.handleSubmitCreate(e)
    } else {
      this.handleSubmitUpdate(e)
    }
  }

  handleChange = (e) => {
    alert(e.target.value)
  }

  render() {
    const name = (
      <h4
        className='column-name'
        onClick={this.handleClick}
      >
        {this.state.name}
      </h4>
    )

    const nameElement = this.state.isEditing
      ? (<ApiInput
          value={this.state.name}
          submit={this.handleSubmit}
          focus={true}
        />)
      : name


    return (
      <div
        ref={node => this.node = node}
      >
        {nameElement}
      </div>
    )
  }
}
