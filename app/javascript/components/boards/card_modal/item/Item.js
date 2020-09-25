import React from 'react'
import PropTypes from 'prop-types'
import i18n from '../../../../i18n'
import Note from './Note'
import Avatar from '../../../shared/avatar/Avatar'

import { CardItemApi } from '../../../../api/InternalApi'

export default function Item(props) {
  const {
    author_name,
    author_avatar,
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

    let response = await CardItemApi.createItem(params)
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
          content={params.content}
        />
      )
      break
  }

  const contentClass = uuid === 'new'
    ? ''
    : 'bg-light rounded p-3 pr-5'

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
      <div className={contentClass}>
        {item}
      </div>
      {uuid !== 'new' &&
        <div className="float-right mt-n4 mr-n2">
          <Avatar
            name={author_name}
            url={author_avatar}
            size="md"
          />
        </div>
      }
    </div>
  )
}

Item.propTypes = {
  cardUuid:   PropTypes.string.isRequired,
  item:       PropTypes.object.isRequired,
  removeItem: PropTypes.func.isRequired
}