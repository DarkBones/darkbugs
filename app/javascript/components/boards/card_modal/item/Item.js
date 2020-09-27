import React from 'react'
import PropTypes from 'prop-types'
import Ellipsis from '../../../shared/ellipsis/Ellipsis'
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
    author_id,
    author_name,
    author_avatar,
    created_at,
    params,
    type,
    user_is_author,
    uuid
  } = props.item

  const submitItem = async (type, data) => {
    const params = {
      card_uuid: props.cardUuid,
      type: type,
      item: data
    }

    let response = await CardItemApi.createItem(params)

    if (!response) return
    if (response.status !== 200) return

    props.newItem(type, response.data.uuid, response.data)
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

    if (!author_id) return false
    console.log(props.index % 3 === 0)


    return author_id !== previousItem.author_id || props.index % 3 === 0
  }

  let contentClass = ''
  if (uuid !== 'new') {
    contentClass = 'bg-light rounded p-3 pb-4 my-4'

    if (showAvatar()) {
      contentClass += ' mt-n2'
    }
  }

  const deleteItem = () => {
    console.log('delete item')
  }

  const editItem = () => {
    console.log('edit item')
  }

  return (
    <div
      className="card-item"
    >
      {showAvatar() &&
        <hr />
      }
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
        </React.Fragment>
      }

      <div className={contentClass}>
        {item}

        {uuid !== 'new' &&
          <React.Fragment>
            <span className={`float-left badge badge-info-soft mt-3 ml-n3`}>
              <ReactTimeAgo date={created_at}/>
            </span>
            {user_is_author &&
              <Ellipsis
                links={[
                  [i18n.t('components.projects.cards.CardModal.items.menu.edit'), editItem],
                  [i18n.t('components.projects.cards.CardModal.items.menu.delete'), deleteItem]
                ]}
              />
            }
          </React.Fragment>
        }
      </div>
    </div>
  )
}

Item.propTypes = {
  cardUuid:     PropTypes.string.isRequired,
  index:        PropTypes.number.isRequired,
  item:         PropTypes.object.isRequired,
  newItem:      PropTypes.func.isRequired,
  previousItem: PropTypes.object,
  removeItem:   PropTypes.func.isRequired
}