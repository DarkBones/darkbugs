import React          from 'react'
import PropTypes      from 'prop-types'
import TitleInput     from './TitleInput'
import { Draggable }  from 'react-beautiful-dnd'

export default class Card extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isEditing: props.uuid === 'new'
    }
  }

  render() {
    const {
      allCards,
      deleteNewCard,
      name,
      userIsAssigned,
      uuid
    } = this.props

    const dragDisabled = !userIsAssigned || uuid === 'new'

    const element = this.state.isEditing
      ? (
          <TitleInput
            deleteNewCard={deleteNewCard}
          />
        )
      : name

    return (
      <Draggable
        draggableId={uuid}
        index={allCards.indexOf(uuid)}
        isDragDisabled={dragDisabled}
      >
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            id={uuid}
          >
            <div
              className="card item-card"
              id={uuid}
              {...provided.dragHandleProps}
              ref={(card) => {
                this.cardRef = card
              }}
            >
              {element}
            </div>
            <div
              className="item-card-divider"
            />
          </div>
        )}
      </Draggable>
    )
  }
}

Card.propTypes = {
  allCards:       PropTypes.array.isRequired,
  deleteNewCard:  PropTypes.func.isRequired,
  name:           PropTypes.string.isRequired,
  userIsAssigned: PropTypes.bool.isRequired,
  uuid:           PropTypes.string.isRequired
}