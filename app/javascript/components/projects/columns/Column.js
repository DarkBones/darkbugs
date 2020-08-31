import React from 'react'
import {ColumnApi} from '../../../api/InternalApi'
import Title from './Title'
import Cards from '../cards/Cards'
import i18n from '../../../i18n'
import {Droppable} from 'react-beautiful-dnd'
import Card from '../cards/Card'

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
      <Droppable droppableId={this.props.uuid}>
        {(provided, snapshot) => (
          <div
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
            <div
              className='column-body'
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {/*{JSON.stringify(this.props.cardOrder)}*/}
              {/*<Cards*/}
              {/*  cards={this.props.cards}*/}
              {/*/>*/}
              {this.props.cardOrder.map((card) =>
                <Card
                  name={this.props.cards[card].name}
                  key={this.props.cards[card].uuid}
                  id={this.props.cards[card].uuid}
                  uuid={this.props.cards[card].uuid}
                  position={this.props.cards[card].position}
                  index={this.props.cards[card].position}
                />
              )}
              {provided.placeholder}
            </div>
          </div>
        )}
      </Droppable>
    )
  }
}
