import React          from 'react'
import Author         from './Author'
import Form           from '../../../shared/input/Form'
import Note           from './Note'
import PropTypes      from 'prop-types'
import { CardItemApi } from '../../../../api/InternalApi'
import Dropdown from "./Dropdown";

export default class Item extends React.Component {
  constructor(props) {
    super(props)

    this.formParams = this.getFormParams()

    this.state = {
      isEditing: props.item.uuid === 'new'
    }
  }

  editItem = () => {
    this.setIsEditing(true)
  }

  createItem = async (itemParams) => {
    const {
      cardUuid,
      item,
      saveCardItem
    } = this.props
    const { type } = item

    const params = {
      card_uuid: cardUuid,
      type: type,
      item: itemParams
    }

    let response = await CardItemApi.createItem(params)

    if (!response) return
    if (response.status !== 200) return

    saveCardItem(response.data)
  }

  deleteItem = () => {
    console.log('delete item')
  }

  handleCancel = () => {
    this.props.deleteItem('new')

    this.setState({
      isEditing: false
    })
  }

  handleSubmit = async (itemParams) => {
    const { createItem, updateItem } = this

    this.props.uuid === 'new'
      ? createItem(itemParams)
      : updateItem(itemParams)
  }

  getFormParams = () => {
    const { params, type } = this.props.item

    switch (type) {
      case 'note':
        return {
          fieldOrder: ['content'],
          fields: {
            content: {
              name: 'content',
              type: 'text',
              value: params.content
            }
          }
        }
    }
  }

  getItem = () => {
    const { params, type, uuid } = this.props.item

    if (this.state.isEditing) return this.itemForm()

    switch (type) {
      case 'note':
        return (
          <Note
            params={params}
            uuid={uuid}
          />
        )
    }
  }

  itemForm = () => {
    const { handleCancel, handleSubmit } = this
    const { fieldOrder, fields } = this.formParams

    return (
      <Form
        fieldOrder={fieldOrder}
        fields={fields}
        formId={this.props.uuid}
        handleCancel={handleCancel}
        handleSubmit={handleSubmit}
      />
    )
  }

  setIsEditing = isEditing => {
    this.setState({
      isEditing: isEditing
    })
  }

  updateItem = async (itemParams) => {
    let response = await CardItemApi
      .updateItem(this.props.uuid, {item: itemParams})

    if (!response) return
    if (response.status !== 200) console.log(response)

    this.setState({
      isEditing: false
    })

    this.props.updateCardItem(this.props.uuid, itemParams)
  }

  render() {
    const { editItem, deleteItem } = this
    const { item, previousItem } = this.props

    const itemElement = this.getItem()

    return (
      <React.Fragment>
        <Author
          item=         {item}
          isEditing=    {this.state.isEditing}
          previousItem= {previousItem}
        />
        <div className="card-item">
          <Dropdown
            editItem={editItem}
            deleteItem={deleteItem}
            userIsAuthor={item.user_is_author}
          />
          {itemElement}
        </div>
      </React.Fragment>
    )
  }
}

Item.propTypes = {
  cardUuid:       PropTypes.string.isRequired,
  deleteItem:     PropTypes.func.isRequired,
  item:           PropTypes.object.isRequired,
  previousItem:   PropTypes.object,
  saveCardItem:   PropTypes.func.isRequired,
  uuid:           PropTypes.string.isRequired,
  updateCardItem: PropTypes.func.isRequired
}