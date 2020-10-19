import React          from 'react'
import Form           from '../../../shared/input/Form'
import Note           from './Note'
import PropTypes      from 'prop-types'
import { CardItemApi } from '../../../../api/InternalApi'

export default class Item extends React.Component {
  constructor(props) {
    super(props)

    this.formParams = this.getFormParams()

    this.state = {
      isEditing: props.item.uuid === 'new'
    }
  }

  handleCancel = () => {
    this.props.cancelNewItem()
  }

  handleSubmit = async (itemParams) => {
    const { cardUuid, item, saveCardItem } = this.props
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
        handleCancel={handleCancel}
        handleSubmit={handleSubmit}
      />
    )
  }

  render() {
    const item = this.getItem()

    return (
      <div className="card-item">
        {item}
      </div>
    )
  }
}

Item.propTypes = {
  cancelNewItem:  PropTypes.func.isRequired,
  cardUuid:       PropTypes.string.isRequired,
  item:           PropTypes.object.isRequired,
  saveCardItem:   PropTypes.func.isRequired
}