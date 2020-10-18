import React      from 'react'
import CardModal  from './card_modal/CardModal'
import Columns    from './columns/Columns'
import PropTypes  from 'prop-types'
import Title      from './Title'

export default class BoardsApp extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      boardName:      props.name,
      cardOrder:      props.card_order,
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

  setBoardName = name => {
    this.setState({
      boardName: name
    })
  }

  setColumns = (cardOrder, cards, columnOrder, columns) => {
    this.setState({
      ...this.state,
      cardOrder:    cardOrder,
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

  render() {
    const {
      closeCardModal,
      setBoardName,
      setColumns,
      showCardModal
    } = this
    const { board_slug, user_is_assigned } = this.props
    const {
      boardName,
      cardOrder,
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
          card=         {cards[cardModalId]}
          handleClose=  {closeCardModal}
          show=         {this.state.showCardModal}
        />
        <Title
          boardSlug=          {board_slug}
          handleAfterUpdate=  {setBoardName}
          name=               {boardName}
          userIsAssigned=     {user_is_assigned}
        />
        <Columns
          allCards=           {cardOrder}
          boardSlug=          {board_slug}
          cards=              {cards}
          columnOrder=        {columnOrder}
          columns=            {columns}
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