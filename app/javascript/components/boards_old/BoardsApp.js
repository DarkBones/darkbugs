import React      from 'react'
import PropTypes  from 'prop-types'
import CardModal  from './card_modal/CardModal'
import Columns    from './columns/Columns'
import Title      from './title/Title'

export default class BoardsApp extends React.Component {
  constructor(props) {
    super(props)

    this.boardSlug      = props.board_slug
    this.userIsAssigned = props.user_is_assigned

    this.state = {
      cardModal: {
        show: false,
        cardUuid: ''
      },
      cardOrder:    props.card_order,
      cards:        props.cards,
      columnOrder:  props.column_order,
      columns:      props.columns,
      name:         props.name
    }
  }

  closeCardModal = () => {
    this.setState({
      ...this.state,
      cardModal: {
        ...this.state.cardModal,
        show: false,
        cardId: ''
      }
    })
  }

  updateBoardName = name => {
    this.setState({
      name: name
    })
  }

  setColumns = (columnOrder, columns) => {
    this.setState({
      columnOrder: columnOrder,
      columns: columns
    })
  }

  setCards = (cardOrder, cards) => {
    this.setState({
      cardOrder: cardOrder,
      cards: cards
    })
  }

  showCardModal = cardUuid => {
    this.setState({
      ...this.state,
      cardModal: {
        ...this.state.cardModal,
        show: true,
        cardUuid: cardUuid
      }
    })
  }

  render() {
    const {
      boardSlug,
      userIsAssigned,
      setCards,
      setColumns,
      showCardModal,
      updateBoardName
    } = this

    const {
      cardModal,
      cardOrder,
      cards,
      columnOrder,
      columns,
      name
    } = this.state

    return (
      <div id="project-items-app">
        <CardModal
          show={cardModal.show}
          cardUuid={cardModal.cardUuid}
          handleClose={this.closeCardModal}
        />
        <Title
          boardSlug=          {boardSlug}
          handleAfterUpdate=  {updateBoardName}
          name=               {name}
          userIsAssigned=     {userIsAssigned}
        />
        <Columns
          boardSlug=      {boardSlug}
          cardOrder=      {cardOrder}
          cards=          {cards}
          columnOrder=    {columnOrder}
          columns=        {columns}
          setCards=       {setCards}
          setColumns=     {setColumns}
          showCardModal=  {showCardModal}
          userIsAssigned= {userIsAssigned}
        />
      </div>
    )
  }
}

BoardsApp.propTypes = {
  board_slug:       PropTypes.string.isRequired,
  card_order:       PropTypes.array.isRequired,
  cards:            PropTypes.object.isRequired,
  column_order:     PropTypes.array.isRequired,
  columns:          PropTypes.object.isRequired,
  name:             PropTypes.string.isRequired,
  user_is_assigned: PropTypes.bool.isRequired
}