import React from 'react'
import PropTypes from 'prop-types'
import ApiInput from '../../../shared/input/ApiInput'
import { CardApi } from '../../../../api/InternalApi'

import {
  Draggable
} from 'react-beautiful-dnd'

export default class Card extends React.Component {
  constructor(props) {
    super(props)

    this.isNew = props.card.uuid === 'new'
    this.dragDisabled = false

    if (!props.userIsAssigned || this.isNew) {
      this.dragDisabled = true
    }

    this.state = {
      name: props.card.name
    }
  }

  componentDidMount() {
    if (this.isNew) {
      document.addEventListener('mousedown', this.handleClick);
    }
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClick);
  }

  handleClick = e => {
    if (!this.cardRef.contains(e.target)) {
      this.props.cancelNewCard()
    }
  }

  handleSubmit = async () => {
    console.log(this.props)
    let response = CardApi
      .createCard({
        above_card: this.props.card.above_card,
        column_uuid: this.props.columnUuid,
        card: {
          name: this.state.name
        }
      })

    console.log(response)
  }

  handleOnChange = e => {
    this.setState({
      name: e.target.value
    })
  }

  render() {
    const { card, userIsAssigned } = this.props

    const cardName = this.isNew
      ? (
        <ApiInput
          handleSubmit={this.handleSubmit}
          handleCancel={this.props.cancelNewCard}
          handleOnChange={this.handleOnChange}
          name='name'
          focus={true}
          value={this.state.name}
        />
      )
      : card.name

    return (
      // <div className='card'>
      //   {card.name}
      // </div>
      <Draggable
        draggableId={card.uuid}
        index={card.index}
        isDragDisabled={this.dragDisabled}
      >
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <div
              className='card item-card'
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
  userIsAssigned: PropTypes.bool.isRequired,
  cancelNewCard:  PropTypes.func.isRequired
}
