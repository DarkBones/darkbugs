import React          from 'react'
import Card           from './card/Card'
import PropTypes      from 'prop-types'
import { Droppable }  from 'react-beautiful-dnd'

export default function Body(props) {
  const {
    cards,
    cardOrder,
    columnUuid,
    findPreviousCard,
    userIsAssigned
  } = props

  const handleOnClick = e => {
    // const previousCard = findPreviousCard(e)=
    // console.log(previousCard)

    if (e.target.classList.contains('item-card')) return

    const previousCard = findPreviousCard(e)

    console.log(previousCard)
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
          {cardOrder.map((id, index) =>
            <Card
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
  cards:          PropTypes.object.isRequired,
  cardOrder:      PropTypes.array.isRequired,
  columnUuid:     PropTypes.string.isRequired,
  userIsAssigned: PropTypes.bool.isRequired
}