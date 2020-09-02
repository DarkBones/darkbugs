import React from 'react'
import Columns from './columns/Columns'
import { DragDropContext } from 'react-beautiful-dnd'
import { BoardApi } from '../../api/InternalApi'

export default class ProjectItemsApp extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      columns: props.columns,
      cards: props.cards
    }
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

    if (type === 'column') {
      this.updateColumnOrder(source, destination, draggableId)
    }
  }

  updateColumnOrder = async (source, destination, draggableId) => {
    const oldColumnIds = this.state.columns.order
    const newColumnIds = Array.from(this.state.columns.order)

    newColumnIds.splice(source.index, 1)
    newColumnIds.splice(destination.index, 0, draggableId)

    this.setState({
      columns: {
        ...this.state.columns,
        order: newColumnIds
      }
    })

    let response = await BoardApi.reorderColumns(this.props.board_slug, {
      columns: newColumnIds
    })

    if (typeof (response) === 'undefined' || response.data !== 'success') {
      this.setState({
        columns: {
          ...this.state.columns,
          order: oldColumnIds
        }
      })
    }
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
