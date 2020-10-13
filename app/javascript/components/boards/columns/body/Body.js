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
    isDragging,
    findPreviousCard,
    userIsAssigned
  } = props

  const createNewCard = e => {
    const previousCard = findPreviousCard(e)

    addCard(columnUuid, 'new', '', previousCard)
  }

  const handleOnClick = e => {
    // todo: open card modal
    if (e.target.classList.contains('item-card')) return

    if (isDragging) return

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
              allCards={allCards}
              key={id}
              name={cards[id].name}
              userIsAssigned={userIsAssigned}
              uuid={id}
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
  isDragging:     PropTypes.bool.isRequired,
  userIsAssigned: PropTypes.bool.isRequired
}