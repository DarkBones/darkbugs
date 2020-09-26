import React      from 'react'
import Body       from './Body'
import Modal      from '../../shared/modal/Modal'
import PropTypes  from 'prop-types'

import {
  CardApi
} from '../../../api/InternalApi'

export default class CardModal extends React.Component {
  constructor(props) {
    super(props)

    this.default_card = {
      item_order: [],
      items: {},
      name: '',
      number: '',
      short_name: ''
    }

    this.default_item = {
      uuid: 'new',
      type: '',
      params: {}
    }

    this.default_note = {
      content: ''
    }

    this.default_items = {
      item: this.default_item,
      note: this.default_note
    }

    this.state = {
      card: this.default_card,
      fetchingData: false
    }
  }

  componentDidUpdate = (prevProps) => {
    if (this.props.show !== prevProps.show) {
      if (this.props.show) {
        this.fetchCardData()
      } else {
        this.setState({
          fetchingData: false,
          card: this.default_card
        })
      }
    }
  }

  handleClose = () => {
    this.props.handleClose()
  }

  handleSubmit = () => {
    alert('submit')
  }

  fetchCardData = async () => {
    this.setState({
      fetchingData: true
    })

    let response = await CardApi.getDetails(this.props.cardUuid)

    if (response) {
      this.setState({
        fetchingData: false,
        card: response.card
      })
    }
  }

  newItem = (type, uuid, params) => {
    const state = this.removeItemState('new')
    let item = this.default_item
    const itemOrder = Array.from(state.card.item_order)
    itemOrder.push(uuid)

    switch(type) {
      case 'note':
        item = {
          ...item,
          uuid: uuid,
          type: 'note',
          params: params
        }
        break
      default:
        console.log('UNKNOWN TYPE')
    }

    const newState = {
      ...state,
      card: {
        ...state.card,
        item_order: itemOrder,
        items: {
          ...state.card.items,
          [item.uuid]: item
        }
      }
    }

    this.setState(newState)
  }

  removeItem = uuid => {
    this.setState(this.removeItemState(uuid))
  }

  removeItemState = uuid => {
    const items = this.state.card.items
    delete items[uuid]

    let itemOrder = Array.from(this.state.card.item_order)
    const idx = itemOrder.indexOf(uuid)

    if(idx >= 0) {
      itemOrder.splice(idx, 1)
    }

    return {
      ...this.state,
      card:{
        ...this.state.card,
        item_order: itemOrder,
        items: items
      }
    }
  }

  render() {
    const {
      show
    } = this.props

    const {
      card
    } = this.state

    const body = (
      <Body
        card={card}
        defaultItems={this.default_items}
        newItem={this.newItem}
        removeItem={this.removeItem}
      />
    )

    return (
      <React.Fragment>
        <Modal
          body={body}
          close={this.handleClose}
          show={show}
          includeFooter={false}
          title={`${card.number} - ${card.short_name}`}
        />
      </React.Fragment>
    )
  }
}

CardModal.propTypes = {
  cardUuid: PropTypes.string.isRequired,
  handleClose: PropTypes.func.isRequired,
  includeFooter: PropTypes.bool,
  show: PropTypes.bool.isRequired
}