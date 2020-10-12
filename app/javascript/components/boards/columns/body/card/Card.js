import React          from 'react'
import PropTypes      from 'prop-types'
import { Draggable }  from 'react-beautiful-dnd'

export default class Card extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isEditing: false,
      name: props.name
    }
  }

  render() {
    const {
      index,
      userIsAssigned,
      uuid
    } = this.props

    const dragDisabled = !userIsAssigned || uuid === 'new'

    return (
      <Draggable
        draggableId={uuid}
        index={index}
        isDragDisabled={dragDisabled}
      >
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <div
              className="card item-card"
              id={uuid}
              ref={(card) => {
                this.cardRef = card
              }}
            >
              CARD
            </div>
          </div>
        )}
      </Draggable>
    )
  }
}

Card.propTypes = {
  name:           PropTypes.string.isRequired,
  userIsAssigned: PropTypes.bool.isRequired,
  uuid:           PropTypes.string.isRequired
}