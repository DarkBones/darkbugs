import React from 'react'
import Columns from './columns/Columns'
import { DragDropContext } from 'react-beautiful-dnd'

export default class ProjectItemsApp extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      columns: props.columns,
      cards: props.cards
    }

    console.log(JSON.stringify(props))
  }

  onDragEnd = (result) => {
    const { destination, source, draggableId, type } = result

    if (!destination) {
      return
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return
    }

    const newColumnIds = Array.from(this.state.columns.order)
    newColumnIds.splice(source.index, 1)
    newColumnIds.splice(destination.index, 0, draggableId)

    this.setState({
      columns: {
        columns: this.state.columns.columns,
        order: newColumnIds
      }
    })
  }

  render() {
    return (
      <div id='project-items-app'>
        <DragDropContext onDragEnd={this.onDragEnd}>
          <Columns
            columns={this.state.columns}
            cards={this.state.cards}
          />
        </DragDropContext>
      </div>
    )
  }
}
