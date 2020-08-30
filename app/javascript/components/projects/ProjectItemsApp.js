import React from 'react'
import Columns from './columns/Columns';
import { UserProvider } from './contexts/UserContext'
import CardModal from './cards/CardModal'

export default class ProjectItemsApp extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      columns: props.columns,
      currentColumn: '',
      cardModal: {
        show: false
      }
    }
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

  showCardModal = (column) => {
    this.setState({
      currentColumn: column,
      cardModal: {
        show: true
      }
    })
  }

  hideModal = () => {
    this.setState({
      currentColumn: '',
      cardModal: {
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
            columns={this.props.columns}
            boardSlug={this.props.board_slug}
            showCardModal={this.showCardModal}
          />
        </UserProvider>
      </div>
    )
  }
}
