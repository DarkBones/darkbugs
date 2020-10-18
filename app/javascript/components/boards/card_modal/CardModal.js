import React          from 'react'
import Body           from './Body'
import CardModalState from './utils/CardModalState'
import Modal          from '../../shared/modal/Modal'
import PropTypes      from 'prop-types'
import { CardApi }    from '../../../api/InternalApi'

export default class CardModal extends React.Component {
  constructor(props) {
    super(props)

    const defaultCard = {
      itemOrder: [],
      items: {},
      name: '',
      number: '',
      shortName: ''
    }

    const defaultItem = {
      isEditing: true,
      params: {},
      type: '',
      uuid: 'new'
    }

    this.defaultState = {
      cardData: defaultCard,
      fetchingData: false
    }

    this.defaultItems = {
      note: {
        ...defaultItem,
        type: 'note',
        params: {
          content: ''
        }
      }
    }

    this.state = {
      ...this.defaultState
    }
  }

  cardBody = () => {
    const card = this.state.cardData

    return (
      <Body
        itemOrder={card.itemOrder}
        items=    {card.items}
        name=     {card.name}
        newItem=  {this.newItem}
      />
    )
  }

  newItem = (type, params, uuid = 'new') => {
    const item = {
      ...this.defaultItems[type],
      params: params
    }

    const newState = CardModalState
      .deleteItem(this.state, 'new')

    const itemOrder = Array.from(newState.cardData.itemOrder)
    itemOrder.push(uuid)

    this.setState({
      ...newState,
      cardData: {
        ...newState.cardData,
        itemOrder: itemOrder,
        items: {
          ...newState.cardData.items,
          [item.uuid]: item
        }
      }
    })
  }

  componentDidUpdate = prevProps => {
    const { show } = this.props
    const prevShow = prevProps.show
    const { fetchCardData } = this

    if (show === prevShow) return

    if (show) {
      fetchCardData()
      return
    }

    this.setState({
      ...this.defaultState
    })
  }

  fetchCardData = async () => {
    const { card } = this.props

    this.setState({
      fetchingData: true
    })

    let response = await CardApi.getDetails(card.uuid)
    if (!response) return

    const data = response.card

    this.setState({
      fetchingData: false,
      cardData: {
        itemOrder: data.item_order,
        items: data.items,
        name: data.name,
        number: data.number,
        shortName: data.short_name
      }
    })
  }

  render() {
    const { cardBody } = this

    const {
      show,
      handleClose
    } = this.props

    const { cardData } = this.state

    return (
      <Modal
        body={cardBody()}
        close={handleClose}
        show={show}
        includeFooter={false}
        title={`${cardData.number} - ${cardData.short_name}`}
      />
    )
  }
}

CardModal.propTypes = {
  card:         PropTypes.object,
  handleClose:  PropTypes.func.isRequired,
  show:         PropTypes.bool.isRequired
}