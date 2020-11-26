import React          from 'react'
import CardModal      from './card_modal/CardModal'
import Columns        from './columns/Columns'
import ColumnsState   from './columns/utils/ColumnsState'
import NewBoardModal  from './new_board_modal/NewBoardModal'
import PropTypes      from 'prop-types'
import Title          from './Title'

export default class BoardsApp extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      boardName:          props.name,
      boardOrder:         props.board_order,
      boards:             props.boards,
      allCards:           props.card_order,
      cards:              props.cards,
      columnOrder:        props.column_order,
      columns:            props.columns,
      component:          props.component,
      showCardModal:      false,
      cardModalId:        '',
      showNewBoardModal:  false
    }
  }

  closeCardModal = () => {
    this.setState({
      showCardModal: false,
      cardModalId: ''
    })
  }

  closeNewBoardModal = () => {
    this.setState({
      showNewBoardModal: false
    })
  }

  deleteCard = cardUuid => {
    this.closeCardModal()

    const newState = ColumnsState.deleteCard(this.state, cardUuid)

    this.setState(newState, function(){ delete this.state.cards[cardUuid] })
  }

  setBoardName = name => {
    this.setState({
      boardName: name
    })
  }

  setColumns = (allCards, cards, columnOrder, columns) => {
    this.setState({
      ...this.state,
      allCards:     allCards,
      cards:        cards,
      columnOrder:  columnOrder,
      columns:      columns
    })
  }

  showCardModal = cardUuid => {
    if (cardUuid === 'new') return

    this.setState({
      showCardModal: true,
      cardModalId: cardUuid
    })
  }

  showNewBoardModal = () => {
    this.setState({
      showNewBoardModal: true
    })
  }

  updateCardName = (cardUuid, newName) => {
    this.setState({
      ...this.state,
      cards: {
        ...this.state.cards,
        [cardUuid]: {
          ...this.state.cards[cardUuid],
          name: newName
        }
      }
    })
  }

  render() {
    const {
      closeCardModal,
      closeNewBoardModal,
      deleteCard,
      setBoardName,
      setColumns,
      showCardModal,
      updateCardName,
      showNewBoardModal
    } = this
    const { board_slug, user_is_assigned } = this.props
    const {
      boardName,
      boardOrder,
      boards,
      allCards,
      cards,
      columnOrder,
      columns,
      cardModalId,
      component
    } = this.state

    return (
      <div
        id="project-items-app"
      >
        <CardModal
          boardSlug=        {board_slug}
          card=             {cards[cardModalId]}
          handleClose=      {closeCardModal}
          handleDeleteCard= {deleteCard}
          show=             {this.state.showCardModal}
          updateCardName=   {updateCardName}
          userIsAssigned=   {user_is_assigned}
        />
        <NewBoardModal
          boardSlug=    {board_slug}
          component=    {component}
          handleClose=  {closeNewBoardModal}
          show=         {this.state.showNewBoardModal}
        />
        <Title
          boardOrder=         {boardOrder}
          boards=             {boards}
          component=          {component}
          handleAfterUpdate=  {setBoardName}
          name=               {boardName}
          userIsAssigned=     {user_is_assigned}
          showNewBoardModal=  {showNewBoardModal}
        />
        <Columns
          allCards=           {allCards}
          boardSlug=          {board_slug}
          cards=              {cards}
          columnOrder=        {columnOrder}
          columns=            {columns}
          deleteCard=         {deleteCard}
          setColumns=         {setColumns}
          showCardModal=      {showCardModal}
          userIsAssigned=     {user_is_assigned}
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
  component:        PropTypes.object.isRequired,
  name:             PropTypes.string.isRequired,
  user_is_assigned: PropTypes.bool.isRequired
}