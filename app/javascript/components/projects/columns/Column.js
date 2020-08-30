import React from 'react'
import {ColumnApi} from '../../../api/InternalApi'
import Title from './Title'
import Cards from '../cards/Cards'
import i18n from '../../../i18n'
import {Droppable} from 'react-beautiful-dnd'

export default class Column extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isNew: props.uuid === ''
    }
  }

  deleteColumn = async () => {
    let r = confirm(i18n.t('components.projects.columns.Column.delete_warning'))

    if (!r) {
      return
    }

    let response = ColumnApi
      .deleteColumn(this.props.uuid)

    if (typeof (response) !== 'undefined') {
      this.props.deleteColumn(this.props.uuid)
    }
  }

  handleClick = (e) => {
    if (this.title.contains(e.target)) {
      return
    }

    let aboveCardId = ''

    if (!e.target.classList.contains('item-card-divider') && !e.target.classList.contains('column')) {
      return
    } else if (e.target.classList.contains('item-card-divider')) {
      aboveCardId = e.target.getAttribute('id')
    }

    this.props.showCardModal(this.props.uuid, aboveCardId)
  }

  render() {
    return (
      <Droppable droppableId="droppable-1" type="PERSON">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            style={{backgroundColor: snapshot.isDraggingOver ? 'blue' : 'grey'}}
            {...provided.droppableProps}
            className='column rounded'
            onClick={this.handleClick}
          >
            <div
              className='column-title'
              ref={title => this.title = title}
            >
              <Title
                name={this.props.name}
                uuid={this.props.uuid}
                cancelNewColumns={this.props.cancelNewColumns}
                saveNewColumn={this.props.saveNewColumn}
                boardSlug={this.props.boardSlug}
                handleDeleteClick={this.deleteColumn}
              />
            </div>
            <div className='column-body'>
              <Cards
                cards={this.props.cards}
              />
            </div>
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    )
  }
}
