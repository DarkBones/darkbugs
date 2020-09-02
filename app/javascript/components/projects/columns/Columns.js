import React from 'react'
import { Droppable } from 'react-beautiful-dnd'
import Column from './Column'
import CardModal from './card_modal/CardModal'

export default class Columns extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      cardModal: {
        show: false,
        aboveCardId: '',
        currentColumn: ''
      }
    }
  }

  showCardModal = (columnUuid, aboveCardUuid) => {
    this.setState({
      cardModal: {
        show: true,
        aboveCardId: aboveCardUuid,
        currentColumn: columnUuid
      }
    })
  }

  hideCardModal = () => {
    this.setState({
      cardModal: {
        show: false,
        aboveCardId: '',
        currentColumn: ''
      }
    })
  }

  updateCards = (columnId, cards) => {
    console.log('update cards')
  }

  render() {
    return (
      <React.Fragment>
        <CardModal
          modal={this.state.cardModal}
          hideModal={this.hideCardModal}
          updateCards={this.updateCards}
        />
        <Droppable
          droppableId='dropable_columns'
          direction='horizontal'
          type='column'
        >
          {(provided, snapshot) => (
            <div
              id='columns'
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {this.props.columns.order.map((column, index) =>
                <Column
                  key={this.props.columns.columns[column].uuid}
                  column={this.props.columns.columns[column]}
                  index={index}
                  showCardModal={this.showCardModal}
                />
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </React.Fragment>
    )
  }
}
