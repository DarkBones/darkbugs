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
      boardOrder: [],
      boards: {},
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
      newBoard,
      newItem,
      removeNewBoard,
      saveCardItem,
      saveCardName,
      submitCardBoard,
      updateCardItem
    } = this

    const card = this.state.cardData
    const { boardSlug, userIsAssigned } = this.props

    return (
      <Body
        boardOrder=     {card.boardOrder}
        boards=         {card.boards}
        boardSlug=      {boardSlug}
        cardUuid=       {card.uuid}
        deleteCard=     {deleteCard}
        deleteItem=     {deleteItem}
        itemOrder=      {card.itemOrder}
        items=          {card.items}
        name=           {card.name}
        newBoard=       {newBoard}
        newItem=        {newItem}
        saveCardItem=   {saveCardItem}
        saveName=       {saveCardName}
        submitCardBoard={submitCardBoard}
        removeNewBoard= {removeNewBoard}
        updateCardItem= {updateCardItem}
        userIsAssigned= {userIsAssigned}
      />
    )
  }

  newBoard = (name, slug = '') => {
    const boardOrder = Array.from(this.state.cardData.boardOrder)
    const idx = boardOrder.indexOf('')
    if (idx > 0) boardOrder.splice(idx, 1)

    boardOrder.push(slug)

    this.setState({
      ...this.state,
      cardData: {
        ...this.state.cardData,
        boardOrder: boardOrder,
        boards: {
          ...this.state.cardData.boards,
          [slug]: {
            name: name,
            slug: slug
          }
        }
      }
    })
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
        boardOrder: data.board_order,
        boards: data.boards,
        itemOrder: data.item_order,
        items: data.items,
        name: data.name,
        number: data.number,
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

  submitCardBoard = data => {
    console.log('submit cardboard', data)
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
  boardSlug:        PropTypes.string.isRequired,
  card:             PropTypes.object,
  handleClose:      PropTypes.func.isRequired,
  handleDeleteCard: PropTypes.func.isRequired,
  show:             PropTypes.bool.isRequired,
  updateCardName:   PropTypes.func.isRequired,
  userIsAssigned:   PropTypes.bool.isRequired
}