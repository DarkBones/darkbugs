import React from 'react'
import Columns from './columns/Columns';

export default class ProjectItemsApp extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      columns: props.columns
    }
  }

  render() {
    return (
      <div
        id='project-items-app'
      >
        <h1>
          {this.props.name}
        </h1>
        <Columns
          columns={this.props.columns}
        />
      </div>
    )
  }
}
