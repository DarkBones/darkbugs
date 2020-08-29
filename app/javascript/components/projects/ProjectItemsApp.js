import React from 'react'
import Columns from './columns/Columns';
import { UserProvider } from './contexts/UserContext'
import CardModal from './cards/CardModal'

export default class ProjectItemsApp extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      columns: props.columns,
      cardModal: {
        show: false,
        column: ''
      }
    }
  }

  showCardModal = (column) => {
    this.setState({
      cardModal: {
        show: true,
        column: column
      }
    })
  }

  hideModal = () => {
    this.setState({
      cardModal: {
        show: false,
        column: ''
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
            modal={this.state.cardModal}
            hideModal={this.hideModal}
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
