import React      from 'react'
import PropTypes  from 'prop-types'
import Columns    from './columns/Columns'
import Title      from './title/Title'

export default class BoardsApp extends React.Component {
  constructor(props) {
    super(props)

    this.boardSlug      = props.board_slug
    this.userIsAssigned = props.user_is_assigned

    this.state = {
      cardOrder:    props.card_order,
      cards:        props.cards,
      columnOrder:  props.column_order,
      columns:      props.columns,
      name:         props.name
    }

    console.log(props)
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

  render() {
    const {
      boardSlug,
      userIsAssigned,
      setCards,
      setColumns,
      updateBoardName
    } = this

    const {
      cardOrder,
      cards,
      columnOrder,
      columns,
      name
    } = this.state

    return (
      <div id="project-items-app">
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