import React      from 'react'
import PropTypes  from 'prop-types'

import {
  CardApi
} from '../../../../../api/InternalApi'
import {
  Draggable
} from 'react-beautiful-dnd'
import ApiInput from "../../../../shared/input/ApiInput";

export default class Card extends React.Component {
  constructor(props) {
    super(props)

    this.isNew = props.card.uuid === 'new'
    this.dragDisabled = !props.userIsAssigned || this.isNew;

    this.state = {
      name: props.card.name
    }
  }

  cancelNewCard = () => {
    this.props.deleteCard('new')
  }

  handleOnChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  handleSubmit = async () => {
    const {
      card,
      columnUuid
    } = this.props

    const params = {
      column_uuid: columnUuid,
      previous_card: card.above_card,
      card: {
        name: this.state.name
      }
    }

    let response = await CardApi
      .createCard(params)

    console.log(response)
  }

  render() {
    const {
      card,
      index
    } = this.props

    const {
      cancelNewCard,
      dragDisabled,
      handleOnChange,
      handleSubmit,
      isNew
    } = this

    const cardName = isNew
      ? (
        <ApiInput
          handleCancel={cancelNewCard}
          handleOnChange={handleOnChange}
          handleSubmit={handleSubmit}
          name="name"
          focus={true}
          value={this.state.name}
        />
      )
      : card.name

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
  card:           PropTypes.object.isRequired,
  columnUuid:     PropTypes.string.isRequired,
  deleteCard:     PropTypes.func.isRequired,
  index:          PropTypes.number.isRequired,
  previousCard:   PropTypes.string,
  userIsAssigned: PropTypes.bool.isRequired
}