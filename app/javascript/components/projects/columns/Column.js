import React from 'react'
import {Draggable, Droppable} from 'react-beautiful-dnd'
import Card from './Card'

export default class Column extends React.Component {
  constructor(props) {
    super(props)
  }

  handleClick = (e) => {
    if (this.title.contains(e.target)) {
      return
    }

    let aboveCardId = ''

    if (!e.target.classList.contains('item-card-divider') && !e.target.classList.contains('column-body')) {
      return
    } else if (e.target.classList.contains('item-card-divider')) {
      aboveCardId = e.target.getAttribute('id')
    }

    this.props.showCardModal(this.props.column.uuid, aboveCardId)
  }

  render() {
    const column = this.props.column
    return (
      <Draggable
        draggableId={column.uuid}
        index={this.props.index}
      >
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
          >
            <div
              className='column rounded'
            >
              <div
                className='column-title'
                ref={title => this.title = title}
              >
                <h1 {...provided.dragHandleProps}>
                  {this.props.column.name}
                </h1>
              </div>
              <Droppable droppableId={this.props.column.uuid} type='card'>
                {(provided, snapshot) => (
                  <div
                    className='column-body'
                    onClick={this.handleClick}
                    style={{height: '100%', width: '100%'}}
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    {this.props.column.card_uuids.map((cardUuid) =>
                      <Card card={this.props.cards[cardUuid]} key={cardUuid}/>
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          </div>
        )}
      </Draggable>
    )
  }
}
