import React from 'react'
import Columns from './columns/Columns';
import { UserProvider } from './contexts/UserContext'

export default class ProjectItemsApp extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      columns: props.columns
    }
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
          <h1>
            {this.props.name}
          </h1>
          <Columns
            columns={this.props.columns}
            userIsAdmin={this.props.user_is_admin}
            boardSlug={this.props.board_slug}
          />
        </UserProvider>
      </div>
    )
  }
}
