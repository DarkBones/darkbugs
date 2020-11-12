import React          from 'react'
import Body           from './Body'
import CardModalState from './utils/CardModalState'
import i18n           from '../../../i18n'
import Modal          from '../../shared/modal/Modal'
import PropTypes      from 'prop-types'
import String         from '../../shared/string/String'
import { CardApi }    from '../../../api/InternalApi'

export default class CardModal extends React.Component {
  constructor(props) {
    super(props)

    const defaultCard = {
      itemOrder: [],
      items: {},
      name: '',
      number: '',
      shortName: '',
      uuid: ''
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

  deleteCard = async () => {
    if (this.state.cardData.itemOrder.length > 0) {
      let r = confirm(
        i18n.t('components.projects.cardmodal.toolbar.delete_confirm')
      )

      if (!r) return
    }

    const cardUuid = this.props.card.uuid

    let response = await CardApi.deleteCard(cardUuid)

    if (!response) return
    if (response.status !== 200) return

    this.props.handleDeleteCard(cardUuid)
  }

  deleteItem = itemUuid => {
    let newState = CardModalState
      .deleteItem(this.state, 'new')

    newState = CardModalState
      .deleteItem(newState, itemUuid)

    this.setState(newState)
  }

  cardBody = () => {
    const {
      deleteCard,
      deleteItem,
      newItem,
      saveCardItem,
      saveCardName,
      updateCardItem
    } = this

    const card = this.state.cardData

    return (
      <Body
        cardUuid=       {card.uuid}
        deleteCard=     {deleteCard}
        deleteItem=     {deleteItem}
        itemOrder=      {card.itemOrder}
        items=          {card.items}
        name=           {card.name}
        newItem=        {newItem}
        saveCardItem=   {saveCardItem}
        saveName=       {saveCardName}
        updateCardItem= {updateCardItem}
        userIsAssigned= {this.props.userIsAssigned}
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

  saveCardName = newName => {
    this.setState({
      ...this.state,
      cardData: {
        ...this.state.cardData,
        name: newName
      }
    })

    this.props.updateCardName(this.state.cardData.uuid, newName)
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
        shortName: data.short_name,
        uuid: data.uuid
      }
    })
  }

  saveCardItem = data => {
    const newState = CardModalState.addItem(this.state, data)

    this.setState(newState)
  }

  updateCardItem = (uuid, params) => {
    const { state } = this

    this.setState({
      ...state,
      cardData: {
        ...state.cardData,
        items: {
          ...state.cardData.items,
          [uuid]: {
            ...state.cardData.items[uuid],
            params: params
          }
        }
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

    const shortName = String.shorten(cardData.name, 48)

    return (
      <Modal
        body={cardBody()}
        close={handleClose}
        show={show}
        includeFooter={false}
        title={`${cardData.number} - ${shortName}`}
      />
    )
  }
}

CardModal.propTypes = {
  card:             PropTypes.object,
  handleClose:      PropTypes.func.isRequired,
  handleDeleteCard: PropTypes.func.isRequired,
  show:             PropTypes.bool.isRequired,
  updateCardName:   PropTypes.func.isRequired,
  userIsAssigned:   PropTypes.bool.isRequired
}