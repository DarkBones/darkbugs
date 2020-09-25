import React from 'react'
import PropTypes from 'prop-types'
import i18n from '../../../../i18n'
import Note from './Note'
import Avatar from '../../../shared/avatar/Avatar'

import JavascriptTimeAgo from 'javascript-time-ago'

import en from 'javascript-time-ago/locale/en'

import { CardItemApi } from '../../../../api/InternalApi'

JavascriptTimeAgo.addLocale(en)

import ReactTimeAgo from 'react-time-ago'

export default function Item(props) {
  const {
    author_name,
    author_avatar,
    created_at,
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

  const previousItem = props.previousItem

  const showAvatar = () => {
    if (uuid === 'new') return false

    if (!previousItem) return true

    if (!item.author_id) return false

    return previousItem.author_id !== item.author_id
  }

  let contentClass = ''
  if (uuid !== 'new') {
    contentClass = 'bg-light rounded p-3 my-4'

    if (showAvatar()) {
      contentClass += ' mt-n2'
    }
  }

  const timeBadgeClass = showAvatar()
    ? 'mt-2'
    : 'mt-n3'

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

      {uuid !== 'new' &&
        <React.Fragment>
          {showAvatar() &&
            <React.Fragment>
              <div style={{display: 'inline-block'}}>
                <Avatar
                  name={author_name}
                  url={author_avatar}
                  size="md"
                />
              </div>
              <div style={{display: 'inline-block', position: 'relative', top: '-0.6em'}} className="ml-2">
                <h4>{author_name}</h4>
              </div>
            </React.Fragment>
          }

          <span className={`float-right badge badge-info-soft ${timeBadgeClass}`}>
            <ReactTimeAgo date={created_at}/>
          </span>
        </React.Fragment>
      }

      <div className={contentClass}>
        {item}
      </div>
    </div>
  )
}

Item.propTypes = {
  cardUuid:     PropTypes.string.isRequired,
  item:         PropTypes.object.isRequired,
  previousItem: PropTypes.object,
  removeItem:   PropTypes.func.isRequired
}