import React          from 'react'
import Card           from './card/Card'
import PropTypes      from 'prop-types'
import { Droppable }  from 'react-beautiful-dnd'

export default function Body(props) {
  const {
    addCard,
    allCards,
    cards,
    cardOrder,
    columnUuid,
    deleteNewCard,
    isDragging,
    findPreviousCard,
    showCardModal,
    userIsAssigned
  } = props

  const createNewCard = e => {
    const previousCard = findPreviousCard(e)

    addCard(columnUuid, 'new', '', previousCard)
  }

  const handleOnClick = e => {
    if (isDragging) return

    if (e.target.classList.contains('item-card')){
      showCardModal(e.target.id)
      return
    }

    createNewCard(e)
  }

  return (
    <Droppable
      droppableId={columnUuid}
      type="card"
    >
      {(provided) => (
        <div
          className="column-body"
          id=       {columnUuid}
          onClick=  {handleOnClick}
          ref=      {provided.innerRef}
          {...provided.droppableProps}
        >
          {cardOrder.map((id) =>
            <Card
              addCard=        {addCard}
              allCards=       {allCards}
              deleteNewCard=  {deleteNewCard}
              columnUuid=     {columnUuid}
              key=            {id}
              name=           {cards[id].name}
              userIsAssigned= {userIsAssigned}
              uuid=           {id}
            />
          )}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  )
}

Body.propTypes = {
  addCard:        PropTypes.func.isRequired,
  cards:          PropTypes.object.isRequired,
  cardOrder:      PropTypes.array.isRequired,
  columnUuid:     PropTypes.string.isRequired,
  deleteNewCard:  PropTypes.func.isRequired,
  isDragging:     PropTypes.bool.isRequired,
  showCardModal:  PropTypes.func.isRequired,
  userIsAssigned: PropTypes.bool.isRequired
}