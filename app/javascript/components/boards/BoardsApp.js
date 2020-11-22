import React        from 'react'
import CardModal    from './card_modal/CardModal'
import Columns      from './columns/Columns'
import ColumnsState from './columns/utils/ColumnsState'
import PropTypes    from 'prop-types'
import Title        from './Title'
import {useHistory} from 'react-router-dom'

export default class BoardsApp extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      boardName:      props.name,
      boardOrder:     props.board_order,
      boards:         props.boards,
      allCards:       props.card_order,
      cards:          props.cards,
      columnOrder:    props.column_order,
      columns:        props.columns,
      showCardModal:  false,
      cardModalId:    ''
    }
  }

  closeCardModal = () => {
    this.setState({
      showCardModal: false,
      cardModalId: ''
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
      deleteCard,
      setBoardName,
      setColumns,
      showCardModal,
      updateCardName,
    } = this
    const { board_slug, project_path, user_is_assigned } = this.props
    const {
      boardName,
      boardOrder,
      boards,
      allCards,
      cards,
      columnOrder,
      columns,
      cardModalId
    } = this.state

    return (
      <div
        id="project-items-app"
      >
        <CardModal
          card=             {cards[cardModalId]}
          handleClose=      {closeCardModal}
          handleDeleteCard= {deleteCard}
          show=             {this.state.showCardModal}
          updateCardName=   {updateCardName}
          userIsAssigned=   {user_is_assigned}
        />
        <Title
          boardOrder=          {boardOrder}
          boards=             {boards}
          boardSlug=          {board_slug}
          handleAfterUpdate=  {setBoardName}
          name=               {boardName}
          projectPath=        {project_path}
          userIsAssigned=     {user_is_assigned}
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
  name:             PropTypes.string.isRequired,
  user_is_assigned: PropTypes.bool.isRequired
}