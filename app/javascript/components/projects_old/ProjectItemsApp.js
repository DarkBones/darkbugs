import React from 'react'
import Columns from './columns/Columns';
import { UserProvider } from './contexts/UserContext'
import CardModal from './cards/CardModal'

export default class ProjectItemsApp extends React.Component {
  constructor(props) {
    console.log(JSON.stringify(props))
    super(props)

    this.state = {
      cards: props.cards,
      columns: props.columns,
      columnOrder: props.column_order,
      currentColumn: '',
      cardModal: {
        aboveCardId: '',
        show: false
      }
    }

    console.log(JSON.stringify(this.state.columns))
  }

  updateColumns = (columns) => {
    console.log(JSON.stringify(columns))
    this.setState({
      columns: columns
    })
  }

  updateCards = (uuid, cards) => {
    let columns = []

    this.state.columns.forEach(function (column) {
      if (column.uuid === uuid) {
        column.cards = cards
      }

      columns.push(column)
    })

    this.setState({
      columns: columns
    })
  }

  showCardModal = (column, aboveCardId) => {
    this.setState({
      currentColumn: column,
      cardModal: {
        aboveCardId: aboveCardId,
        show: true
      }
    })
  }

  hideModal = () => {
    this.setState({
      currentColumn: '',
      cardModal: {
        aboveCardId: '',
        show: false
      }
    })
  }

  render() {
    const userProviderValues = {
      isAdmin: this.props.user_is_admin
    }

    return (
      <div
        id='project-items-app'
      >
        <UserProvider value={userProviderValues}>
          <CardModal
            column={this.state.currentColumn}
            modal={this.state.cardModal}
            hideModal={this.hideModal}
            updateCards={this.updateCards}
          />
          <h1>
            {this.props.name}
          </h1>
          <Columns
            columns={this.state.columns}
            columnOrder={this.state.columnOrder}
            cards={this.state.cards}
            boardSlug={this.props.board_slug}
            showCardModal={this.showCardModal}
            updateColumns={this.updateColumns}
          />
        </UserProvider>
      </div>
    )
  }
}
