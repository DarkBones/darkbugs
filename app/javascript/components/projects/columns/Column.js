import React from 'react'
import {ColumnApi} from '../../../api/InternalApi'
import Title from './Title';
import i18n from '../../../i18n'

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

    this.props.showCardModal(this.props.uuid)
  }

  render() {
    return (
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
        <div className='column-body'>

        </div>
      </div>
    )
  }
}
