import React              from 'react'
import PropTypes          from 'prop-types'
import Ellipsis           from '../../../shared/ellipsis/Ellipsis'
import i18n               from '../../../../i18n'
import Note               from './Note'
import Avatar             from '../../../shared/avatar/Avatar'

import JavascriptTimeAgo  from 'javascript-time-ago'
import en                 from 'javascript-time-ago/locale/en'
import ReactTimeAgo       from 'react-time-ago'

import { CardItemApi }    from '../../../../api/InternalApi'

JavascriptTimeAgo.addLocale(en)

export default class Item extends React.Component {
  constructor(props) {
    super(props)
  }

  deleteItem = () => {
    console.log('DELETE ITEM')
  }

  editItem = () => {
    this.setEditing(true)
  }

  setEditing = isEditing => {
    this.props.setItemEditing(this.props.item.uuid, isEditing)
  }

  getItem = () => {
    const { item, setItemEditing } = this.props

    const defaultProps = {
      isEditing: this.props.item.is_editing,
      setItemEditing: setItemEditing,
      submitItem: this.submitItem,
      uuid: item.uuid
    }

    switch (item.type) {
      case 'note':
        return (
          <Note
            {...defaultProps}
            content={item.params.content}
          />
        )
    }
  }

  showAvatar = () => {
    const {
      previousItem,
      index,
      item
    } = this.props

    if (item.uuid === 'new') return false

    if (!previousItem) return true

    if (!item.author_id) return false

    return item.author_id !== previousItem.author_id || index % 3 === 0
  }

  submitItem = async (type, item) => {
    const {
      cardUuid,
      newItem
    } = this.props

    const params = {
      card_uuid: cardUuid,
      type: type,
      item: item
    }

    let response = await CardItemApi.createItem(params)

    if (!response) return
    if (response.status !== 200) return

    newItem(type, response.data.uuid, response.data)
  }

  render() {
    const showAvatar = this.showAvatar()
    const item = this.getItem()

    const {
      author_id,
      author_name,
      author_avatar,
      created_at,
      is_editing,
      params,
      type,
      user_is_author,
      uuid
    } = this.props.item

    let contentClass = ''
    if (!is_editing) {
      contentClass = 'bg-light rounded p-3 pb-4 my-4'

      if (showAvatar) {
        contentClass += ' mt-n2'
      }
    }

    return (
      <div
        className="card-item"
      >
        {showAvatar &&
          <hr />
        }

        {uuid !== 'new' &&
          <React.Fragment>
            {showAvatar &&
              <React.Fragment>
                <div style={{display: 'inline-block'}}>
                  <Avatar
                    name={author_name}
                    url={author_avatar}
                    size="md"
                  />
                </div>
                <div
                  style={{display: 'inline-block', position: 'relative', top: '-0.6em'}}
                  className="ml-2"
                >
                  <h4>
                    {author_name}
                  </h4>
                </div>
              </React.Fragment>
            }
          </React.Fragment>
        }

        <div className={contentClass}>
          {item}

          {!is_editing &&
            <React.Fragment>
              <span className={`float-left badge badge-info-soft mt-3 ml-n3`}>
                <ReactTimeAgo date={created_at}/>
              </span>
              {user_is_author &&
                <Ellipsis
                  links={[
                    [i18n.t('components.projects.cards.CardModal.items.menu.edit'), this.editItem],
                    [i18n.t('components.projects.cards.CardModal.items.menu.delete'), this.deleteItem]
                  ]}
                />
              }
            </React.Fragment>
          }
        </div>
      </div>
    )
  }
}