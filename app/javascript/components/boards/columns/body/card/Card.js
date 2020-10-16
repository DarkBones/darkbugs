import React          from 'react'
import PropTypes      from 'prop-types'
import TitleInput     from './TitleInput'
import { CardApi }    from '../../../../../api/InternalApi'
import { Draggable }  from 'react-beautiful-dnd'

export default class Card extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isEditing: props.uuid === 'new'
    }
  }

  handleSubmit = async (newName) => {
    if (!this.props.userIsAssigned) return

    const {
      addCard,
      allCards,
      columnUuid
    } = this.props

    const previousCard = allCards[allCards.indexOf('new') - 1]

    const params = {
      column_uuid: columnUuid,
      previous_card: previousCard,
      card: {
        name: newName
      }
    }

    let response = await CardApi.createCard(params)

    if (!response) return
    if (response.status !== 200) return

    const { name, uuid } = response.data
    addCard(columnUuid, uuid, name, previousCard)
    addCard(columnUuid, 'new', '', uuid)
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
            handleSubmit={this.handleSubmit}
            value={name}
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
  addCard:        PropTypes.func.isRequired,
  allCards:       PropTypes.array.isRequired,
  columnUuid:     PropTypes.string.isRequired,
  deleteNewCard:  PropTypes.func.isRequired,
  name:           PropTypes.string.isRequired,
  userIsAssigned: PropTypes.bool.isRequired,
  uuid:           PropTypes.string.isRequired
}