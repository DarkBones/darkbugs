import React from 'react'
import PropTypes from 'prop-types'
import i18n from '../../../../i18n'
import Note from './Note'

import { CardItemApi } from '../../../../api/InternalApi'

export default function Item(props) {
  const {
    params,
    type,
    uuid
  } = props.item

  const submitItem = async (type, data) => {
    const params = {
      card_uuid: props.cardUuid,
      type: type,
      item: data
    }

    console.log(params)

    let response = await CardItemApi.createItem(params)

    console.log(response)
  }

  let item = <div></div>

  const defaultProps = {
    removeItem: props.removeItem,
    submitItem: submitItem,
    uuid: uuid
  }

  switch(type) {
    case 'note':
      item = (
        <Note
          {...defaultProps}
          uuid={'ttt'}
          content={params.content}
        />
      )
      break
  }

  return (
    <div
      className="card-item"
    >
      <hr />
      {uuid === 'new' &&
        <h4>
          {i18n.t(`components.shared.form.titles.new_${type}`)}
        </h4>
      }
      {item}
    </div>
  )
}

Item.propTypes = {
  cardUuid:   PropTypes.string.isRequired,
  item:       PropTypes.object.isRequired,
  removeItem: PropTypes.func.isRequired
}