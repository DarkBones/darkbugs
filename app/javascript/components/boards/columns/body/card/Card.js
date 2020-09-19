import React      from 'react'
import ApiInput   from '../../../../shared/input/ApiInput'
import PropTypes  from 'prop-types'

import {
  CardApi
} from '../../../../../api/InternalApi'

import {
  Draggable
} from 'react-beautiful-dnd'

export default class Card extends React.Component {
  constructor(props) {
    super(props)

    this.isNew = props.card.uuid === 'new'
    this.dragDisabled = !props.userIsAssigned || this.isNew;

    this.state = {
      isEditing: this.isNew,
      name: props.card.name
    }
  }

  handleOnCancel = () => {
    this.props.deleteCard('new')
  }

  handleOnChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  handleSubmit = async () => {
    if (!this.props.userIsAssigned) return

    this.isNew
      ? this.saveNewCard()
      : this.updateCard()
  }

  saveNewCard = async () => {
    const {
      addCard,
      card,
      columnUuid,
      deleteCard
    } = this.props

    const params = {
      column_uuid: columnUuid,
      previous_card: card.previous_card,
      card: {
        name: this.state.name
      }
    }

    let response = await CardApi
      .createCard(params)

    if (response) {
      if (response.status === 200) {
        const { name, uuid } = response.data
        addCard(columnUuid, uuid, name, card.previous_card)
        addCard(columnUuid, 'new', '', uuid)
        return
      }
    }

    deleteCard('new')
  }

  setEditing = isEditing => {
    this.setState({
      isEditing: isEditing
    })
  }

  startEditing = () => {
    this.setEditing(true)
  }

  stopEditing = () => {
    this.setEditing(false)
  }

  updateCard = async () => {
    console.log('update card')
  }

  render() {
    const {
      card,
      index
    } = this.props

    const {
      dragDisabled,
      handleOnCancel,
      handleOnChange,
      handleSubmit
    } = this

    const cardName = this.state.isEditing
      ? (
        <ApiInput
          handleCancel={handleOnCancel}
          handleOnChange={handleOnChange}
          handleSubmit={handleSubmit}
          name="name"
          focus={true}
          value={this.state.name}
        />
      )
      : (
        <h6>
          {card.name}
        </h6>
      )

    return (
      <Draggable
        draggableId={card.uuid}
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
              ref={(card) => {
                this.cardRef = card
              }}
            >
              {cardName}
            </div>
          </div>
        )}
      </Draggable>
    )
  }
}

Card.propTypes = {
  addCard:        PropTypes.func.isRequired,
  card:           PropTypes.object.isRequired,
  columnUuid:     PropTypes.string.isRequired,
  deleteCard:     PropTypes.func.isRequired,
  index:          PropTypes.number.isRequired,
  previousCard:   PropTypes.string,
  userIsAssigned: PropTypes.bool.isRequired
}