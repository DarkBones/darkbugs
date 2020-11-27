import Column       from './Column';
import PropTypes    from 'prop-types';
import React        from 'react';
import UserContext  from '../UserContext';

import {
  DragDropContext,
  Droppable
} from 'react-beautiful-dnd';

export default class Columns extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isDragging: false
    };
  }

  handleOnDragEnd = result => {
    console.log(result);

    this.setState({
      isDragging: false
    });
  }

  handleOnDragStart = () => {
    this.setState({
      isDragging: true
    });
  }

  render() {
    const {
      handleOnDragEnd,
      handleOnDragStart
    } = this

    const {
      columnOrder,
      columns
    } = this.props;

    return (
      <DragDropContext
        onDragEnd={handleOnDragEnd}
        onDragStat={handleOnDragStart}
      >
        <Droppable
          droppableId="droppable-columns"
          direction="horizontal"
          type="column"
        >
          { provided =>
            <div
              id="columns"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {columnOrder.map((uuid, index) =>
                <Column
                  column={columns[uuid]}
                  index={index}
                  key={uuid}
                  uuid={uuid}
                />
              )}
              {provided.placeholder}
            </div>
          }
        </Droppable>
      </DragDropContext>
    )
  }
}

Columns.propTypes = {
  columnOrder:  PropTypes.array.isRequired,
  columns:      PropTypes.object.isRequired
}